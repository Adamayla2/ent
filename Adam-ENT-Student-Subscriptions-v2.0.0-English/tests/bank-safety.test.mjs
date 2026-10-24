import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { boundedZipRead, validateRasterHeader } from '../server/bank-safety.mjs';
const require = createRequire(import.meta.url);
const JSZip = require('../student/jszip_min.js');

function pngHeader(width, height) {
  const buffer = Buffer.alloc(33);
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(buffer);
  buffer.writeUInt32BE(13, 8); buffer.write('IHDR', 12, 'ascii');
  buffer.writeUInt32BE(width, 16); buffer.writeUInt32BE(height, 20);
  buffer[24] = 8; buffer[25] = 6;
  return buffer;
}
function jpegHeader(width, height, marker = 0xc0) {
  // Header-only fixture: SOI, small APP0, one-component SOF, EOI.
  const buffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 4, 0x4a, 0x46, 0xff, marker, 0, 11, 8, 0, 0, 0, 0, 1, 1, 0x11, 0, 0xff, 0xd9]);
  buffer.writeUInt16BE(height, 13); buffer.writeUInt16BE(width, 15);
  return buffer;
}
function chunk(tag, payload) {
  const result = Buffer.alloc(8 + payload.length + (payload.length & 1));
  result.write(tag, 0, 'ascii'); result.writeUInt32LE(payload.length, 4); payload.copy(result, 8);
  return result;
}
function riff(...chunks) {
  const buffer = Buffer.concat([Buffer.from('RIFF0000WEBP', 'ascii'), ...chunks]);
  buffer.writeUInt32LE(buffer.length - 8, 4);
  return buffer;
}
function lossless(width, height, version = 0) {
  const payload = Buffer.alloc(5); payload[0] = 0x2f;
  payload.writeUInt32LE((((width - 1) & 0x3fff) | (((height - 1) & 0x3fff) << 14) | (version << 29)) >>> 0, 1);
  return chunk('VP8L', payload);
}
function lossy(width, height) {
  const payload = Buffer.from([0x30, 0, 0, 0x9d, 1, 0x2a, 0, 0, 0, 0]);
  payload.writeUInt16LE(width, 6); payload.writeUInt16LE(height, 8);
  return chunk('VP8 ', payload);
}
function extended(width, height, flags = 0) {
  const payload = Buffer.alloc(10); payload[0] = flags;
  payload.writeUIntLE(width - 1, 4, 3); payload.writeUIntLE(height - 1, 7, 3);
  return chunk('VP8X', payload);
}

test('PNG checks real icon header, IHDR layout, nonzero dimensions and pixel cap', async () => {
  const icon = await readFile(new URL('../student/icon-512.png', import.meta.url));
  assert.deepEqual(validateRasterHeader(icon), { mime: 'image/png', width: 512, height: 512 });
  assert.deepEqual(validateRasterHeader(pngHeader(4000, 5000)), { mime: 'image/png', width: 4000, height: 5000 });
  assert.throws(() => validateRasterHeader(pngHeader(5000, 5000)), /pixel limit/);
  assert.throws(() => validateRasterHeader(pngHeader(0, 100)), /pixel limit/);
  const wrong = pngHeader(10, 10); wrong[25] = 9;
  assert.throws(() => validateRasterHeader(wrong), /PNG header/);
  assert.throws(() => validateRasterHeader(icon.subarray(0, 25)), /truncated/);
});

test('JPEG walks metadata and SOF0/SOF2, rejects huge/truncated/unsupported frame headers', () => {
  assert.deepEqual(validateRasterHeader(jpegHeader(1200, 800)), { mime: 'image/jpeg', width: 1200, height: 800 });
  assert.deepEqual(validateRasterHeader(jpegHeader(900, 700, 0xc2)), { mime: 'image/jpeg', width: 900, height: 700 });
  assert.throws(() => validateRasterHeader(jpegHeader(60000, 60000)), /pixel limit/);
  assert.throws(() => validateRasterHeader(jpegHeader(100, 0)), /pixel limit/);
  assert.throws(() => validateRasterHeader(jpegHeader(100, 100, 0xc3)), /Unsupported JPEG frame/);
  assert.throws(() => validateRasterHeader(jpegHeader(100, 100).subarray(0, 17)), /truncated/);
  const bad = jpegHeader(10, 10); bad.writeUInt16BE(65535, 4);
  assert.throws(() => validateRasterHeader(bad), /truncated/);
});

test('WebP supports bounded VP8, VP8L and matching static VP8X dimensions', () => {
  assert.deepEqual(validateRasterHeader(riff(lossy(640, 480))), { mime: 'image/webp', width: 640, height: 480 });
  assert.deepEqual(validateRasterHeader(riff(lossless(900, 600))), { mime: 'image/webp', width: 900, height: 600 });
  assert.deepEqual(validateRasterHeader(riff(extended(640, 480, 0x10), lossy(640, 480))), { mime: 'image/webp', width: 640, height: 480 });
  const realOnePixel = Buffer.from('UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA', 'base64');
  assert.deepEqual(validateRasterHeader(realOnePixel), { mime: 'image/webp', width: 1, height: 1 });
});

test('WebP catches huge internal/canvas dimensions, invalid lengths and animation', () => {
  assert.throws(() => validateRasterHeader(riff(lossy(16000, 16000))), /pixel limit/);
  assert.throws(() => validateRasterHeader(riff(lossless(16384, 16384))), /pixel limit/);
  assert.throws(() => validateRasterHeader(riff(extended(100000, 100000), lossless(1, 1))), /pixel limit/);
  assert.throws(() => validateRasterHeader(riff(extended(1, 1), lossless(900, 800))), /do not match/);
  assert.throws(() => validateRasterHeader(riff(extended(1, 1, 2), lossless(1, 1))), /Animated/);
  assert.throws(() => validateRasterHeader(riff(lossless(1, 1, 1))), /version/);
  assert.throws(() => validateRasterHeader(riff(lossless(1, 1)).subarray(0, 24)), /RIFF byte count/);
  const tooLong = riff(lossless(1, 1)); tooLong.writeUInt32LE(10000, 16);
  assert.throws(() => validateRasterHeader(tooLong), /chunk length/);
  assert.throws(() => validateRasterHeader(Buffer.from('<svg></svg>')), /unsupported/);
});

test('bounded ZIP reader reads real archive bytes within the exact cap', async () => {
  const zip = new JSZip(); zip.file('content.json', '{"safe":true}');
  const loaded = await JSZip.loadAsync(await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
  const content = await boundedZipRead(loaded.file('content.json'), 13, 'Database');
  assert.equal(content.toString(), '{"safe":true}');
});

test('bounded ZIP reader caps actual inflation despite forged declared archive sizes', async () => {
  const zip = new JSZip(); zip.file('bomb.txt', 'x'.repeat(2 * 1024 * 1024));
  const bytes = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  const central = bytes.indexOf(Buffer.from([0x50, 0x4b, 0x01, 0x02]));
  assert.ok(central > 0);
  bytes.writeUInt32LE(1, 22); // Local header's attacker-controlled expanded size.
  bytes.writeUInt32LE(1, central + 24); // Central directory's expanded size.
  const loaded = await JSZip.loadAsync(bytes, { checkCRC32: false });
  const entry = loaded.file('bomb.txt'); assert.equal(entry._data.uncompressedSize, 1);
  await assert.rejects(boundedZipRead(entry, 1024, 'Question image'), /exceeds the extracted byte limit/);
});

test('bounded ZIP reader pauses on overflow and contains asynchronous stream errors', async () => {
  let paused = false; let handlers = {};
  const entry = { _data: { uncompressedSize: 1 }, internalStream(type) {
    assert.equal(type, 'nodebuffer');
    return { on(event, callback) { handlers[event] = callback; return this; }, pause() { paused = true; }, resume() { setImmediate(() => { handlers.data(Buffer.alloc(8)); handlers.data(Buffer.alloc(16)); handlers.error(new Error('late error')); handlers.end(); }); } };
  } };
  await assert.rejects(boundedZipRead(entry, 10, 'Metadata'), /exceeds/); assert.equal(paused, true);
  const failing = { internalStream() { return { on(event, callback) { handlers[event] = callback; return this; }, pause() {}, resume() { setImmediate(() => handlers.error(new Error('bad inflate'))); } }; } };
  await assert.rejects(boundedZipRead(failing, 100, 'Database'), /could not be extracted safely/);
  await assert.rejects(boundedZipRead({ internalStream() { throw new Error('sync'); } }, 100), /could not be extracted safely/);
  await assert.rejects(boundedZipRead(null, 100), /missing/);
});
