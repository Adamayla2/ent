#!/usr/bin/env node
// Node's verified TLS stack avoids Windows Schannel logon-credential failures.
// No package installation, insecure TLS flags, cookies, or credentials are used.
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { mkdir, open, rename, stat, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

const runtimeRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '.toolchain');
function boundedInteger(value, name, maximum) {
  const n = Number(value);
  if (!Number.isSafeInteger(n) || n <= 0 || n > maximum) throw new Error(`Invalid ${name}.`);
  return n;
}
function verifiedUrl(value) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Only HTTPS artifact URLs without embedded credentials are allowed.');
  return url;
}
function runtimePath(value) {
  const resolved = path.resolve(value);
  if (!resolved.toLowerCase().startsWith((runtimeRoot + path.sep).toLowerCase())) throw new Error('Download output must remain inside android/.toolchain/.');
  return resolved;
}
async function request(url, timeoutMs) {
  const signal = AbortSignal.timeout(timeoutMs);
  let current = verifiedUrl(url);
  for (let redirects = 0; ; redirects++) {
    const response = await fetch(current, { redirect: 'manual', signal, headers: { 'User-Agent': 'AdamENT-local-build/1.0', 'Accept-Encoding': 'identity' } });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location');
      await response.body?.cancel();
      if (!location || redirects >= 5) throw new Error('Official artifact exceeded the five-redirect limit or omitted its redirect URL.');
      current = verifiedUrl(new URL(location, current).href);
      continue;
    }
    if (!response.ok) { await response.body?.cancel(); throw new Error(`Official artifact returned HTTP ${response.status}: ${verifiedUrl(url).origin}${verifiedUrl(url).pathname}`); }
    return response;
  }
}
function checkLength(response, maxBytes) {
  const declared = Number(response.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > maxBytes) throw new Error('Artifact Content-Length exceeds its bounded size.');
}
async function text(url, maxBytes, timeoutMs) {
  const response = await request(url, timeoutMs);
  checkLength(response, maxBytes);
  const chunks = [];
  let total = 0;
  for await (const chunk of response.body) {
    total += chunk.byteLength;
    if (total > maxBytes) { await response.body.cancel().catch(() => {}); throw new Error('Official metadata exceeded its streamed size limit.'); }
    chunks.push(chunk);
  }
  process.stdout.write(Buffer.concat(chunks, total).toString('utf8'));
}
async function fileHash(file) {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  return hash.digest('hex');
}
async function download(url, output, expectedHash, maxBytes, timeoutMs) {
  if (!/^[a-f0-9]{64}$/i.test(expectedHash || '')) throw new Error('A valid official SHA-256 checksum is mandatory.');
  output = runtimePath(output);
  const partial = runtimePath(output + '.partial');
  try {
    const existing = await stat(output);
    if (existing.size > maxBytes || await fileHash(output) !== expectedHash.toLowerCase()) throw new Error('The cached archive checksum or size is invalid; inspect the exact cached file before retrying.');
    process.stdout.write(JSON.stringify({ cached: true, bytes: existing.size, sha256: expectedHash.toLowerCase(), output }) + '\n');
    return;
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
  await mkdir(path.dirname(output), { recursive: true });
  // Join a verified download already in progress rather than downloading twice.
  const waitingUntil=Date.now()+timeoutMs;
  while (true) {
    let pending;
    try { pending=await stat(partial); } catch(error) { if(error.code!=='ENOENT')throw error; }
    if (!pending) break;
    if (Date.now()>=waitingUntil || Date.now()-pending.mtimeMs>timeoutMs) throw new Error('A partial archive is still present. Inspect this exact file before retrying: '+partial);
    await delay(1000);
    try {
      const finished=await stat(output);
      if(finished.size>maxBytes || await fileHash(output)!==expectedHash.toLowerCase()) throw new Error('Concurrent archive checksum mismatch.');
      process.stdout.write(JSON.stringify({cached:true,bytes:finished.size,sha256:expectedHash.toLowerCase(),output})+'\n');
      return;
    } catch(error) { if(error.code!=='ENOENT')throw error; }
  }
  const response = await request(url, timeoutMs);
  checkLength(response, maxBytes);
  let file;
  let created = false;
  try {
    file = await open(partial, 'wx');
    created = true;
    const hash = createHash('sha256');
    let total = 0;
    let nextProgress=16*1024*1024;
    for await (const chunk of response.body) {
      total += chunk.byteLength;
      if (total > maxBytes) throw new Error('Artifact exceeded its streamed byte limit.');
      hash.update(chunk);
      let offset = 0;
      while (offset < chunk.byteLength) {
        const { bytesWritten } = await file.write(chunk, offset, chunk.byteLength - offset);
        if (bytesWritten <= 0) throw new Error('The archive could not be written completely.');
        offset += bytesWritten;
      }
      if(total>=nextProgress){process.stderr.write('Downloaded '+Math.round(total/1024/1024)+' MiB: '+path.basename(output)+'\n');nextProgress=total+16*1024*1024;}
    }
    const actualHash = hash.digest('hex');
    if (actualHash !== expectedHash.toLowerCase()) throw new Error('Official archive SHA-256 mismatch.');
    await file.sync();
    await file.close(); file = null;
    await rename(partial, output);
    created = false;
    process.stdout.write(JSON.stringify({ cached: false, bytes: total, sha256: actualHash, output }) + '\n');
  } finally {
    if (file) await file.close().catch(() => {});
    if (created) await unlink(partial).catch(() => {}); // One previously checked file only; no recursive cleanup.
    await response.body?.cancel().catch(() => {});
  }
}
try {
  if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0') throw new Error('Refusing to run while TLS certificate verification is disabled.');
  const [mode, url, ...args] = process.argv.slice(2);
  if (mode === 'text') await text(url, boundedInteger(args[0], 'metadata limit', 16000000), boundedInteger(args[1], 'timeout', 120000));
  else if (mode === 'download') await download(url, args[0], args[1], boundedInteger(args[2], 'archive limit', 1000000000), boundedInteger(args[3], 'timeout', 900000));
  else throw new Error('Usage: official-fetch.mjs text <https-url> <maxBytes> <timeoutMs> | download <https-url> <output> <sha256> <maxBytes> <timeoutMs>');
} catch (error) {
  const detail = error.cause?.code ? ` (${error.cause.code})` : '';
  process.stderr.write(`Official artifact request failed: ${error.message}${detail}\n`);
  process.exitCode = 1;
}
