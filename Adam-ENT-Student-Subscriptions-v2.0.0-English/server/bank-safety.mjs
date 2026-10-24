// Header-only raster validation, not an entropy/image decoder.
// Format references:
// https://www.w3.org/TR/png-3/#11IHDR
// https://github.com/libjpeg-turbo/libjpeg-turbo/blob/main/src/jdmarker.c
// https://developers.google.com/speed/webp/docs/riff_container
// https://developers.google.com/speed/webp/docs/webp_lossless_bitstream_specification
// https://datatracker.ietf.org/doc/html/rfc6386#section-9.1
const MAX_PIXELS = 20000000;
function invalid(message) {
  const error = new Error(message);
  error.status = 400;
  error.code = 'invalid_bank';
  return error;
}
function dimensions(mime, width, height) {
  if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width <= 0 || height <= 0 || width * height > MAX_PIXELS) throw invalid('Image dimensions exceed the supported 20-million-pixel limit.');
  return { mime, width, height };
}

/** Caps bytes actually emitted by JSZip, independently of its untrusted ZIP size fields. */
export function boundedZipRead(entry, maxBytes, kind = 'Archive entry') {
  return new Promise((resolve, reject) => {
    if (!Number.isSafeInteger(maxBytes) || maxBytes <= 0) return reject(invalid('Invalid archive extraction limit.'));
    let stream;
    let settled = false;
    let total = 0;
    let chunks = [];
    const fail = error => {
      if (settled) return;
      settled = true;
      chunks = [];
      try { stream?.pause(); } catch { /* Preserve original failure. */ }
      reject(error?.status === 400 ? error : invalid(`${kind} could not be extracted safely.`));
    };
    try {
      if (!entry || typeof entry.internalStream !== 'function') throw invalid(`${kind} is missing from the archive.`);
      // StreamHelper starts paused. Attach every handler before resuming.
      stream = entry.internalStream('nodebuffer');
      stream.on('data', chunk => {
        if (settled) return;
        try {
          const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
          total += buffer.length;
          if (total > maxBytes) return fail(invalid(`${kind} exceeds the extracted byte limit.`));
          chunks.push(buffer);
        } catch (error) { fail(error); }
      });
      stream.on('error', fail);
      stream.on('end', () => {
        if (settled) return;
        try {
          const buffer = Buffer.concat(chunks, total);
          chunks = [];
          settled = true;
          resolve(buffer);
        } catch (error) { fail(error); }
      });
      stream.resume();
    } catch (error) { fail(error); }
  });
}

function png(bytes) {
  if (bytes.length < 33 || bytes.readUInt32BE(8) !== 13 || bytes.toString('ascii', 12, 16) !== 'IHDR') throw invalid('Invalid or truncated PNG header.');
  const legalDepths = { 0: [1, 2, 4, 8, 16], 2: [8, 16], 3: [1, 2, 4, 8], 4: [8, 16], 6: [8, 16] };
  if (!legalDepths[bytes[25]]?.includes(bytes[24]) || bytes[26] !== 0 || bytes[27] !== 0 || bytes[28] > 1) throw invalid('Unsupported PNG header.');
  return dimensions('image/png', bytes.readUInt32BE(16), bytes.readUInt32BE(20));
}

function jpeg(bytes) {
  let cursor = 2;
  let markers = 0;
  while (cursor < bytes.length && ++markers <= 2000) {
    if (bytes[cursor++] !== 0xff) throw invalid('Invalid JPEG marker header.');
    while (cursor < bytes.length && bytes[cursor] === 0xff) cursor++;
    if (cursor >= bytes.length) break;
    const marker = bytes[cursor++];
    if (marker === 0x00 || marker === 0xd8) throw invalid('Invalid JPEG marker sequence.');
    if (marker === 0xd9 || marker === 0xda) break;
    if (marker === 0x01 || marker >= 0xd0 && marker <= 0xd7) continue;
    if (cursor + 2 > bytes.length) break;
    const length = bytes.readUInt16BE(cursor);
    if (length < 2 || cursor + length > bytes.length) throw invalid('Invalid or truncated JPEG segment.');
    const payload = cursor + 2;
    if ([0xc0, 0xc1, 0xc2].includes(marker)) {
      if (length < 11) throw invalid('Invalid JPEG frame header.');
      const count = bytes[payload + 5];
      if (bytes[payload] !== 8 || ![1, 3, 4].includes(count) || length !== 8 + 3 * count) throw invalid('Unsupported JPEG frame header.');
      return dimensions('image/jpeg', bytes.readUInt16BE(payload + 3), bytes.readUInt16BE(payload + 1));
    }
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) throw invalid('Unsupported JPEG frame encoding.');
    cursor += length;
  }
  throw invalid('A supported JPEG frame header was not found.');
}

function vp8(bytes, start, size) {
  if (size < 10 || (bytes[start] & 1) !== 0 || (bytes[start] >> 1 & 7) > 3 || !bytes.subarray(start + 3, start + 6).equals(Buffer.from([0x9d, 0x01, 0x2a]))) throw invalid('Invalid WebP VP8 key-frame header.');
  return dimensions('image/webp', bytes.readUInt16LE(start + 6) & 0x3fff, bytes.readUInt16LE(start + 8) & 0x3fff);
}
function vp8l(bytes, start, size) {
  if (size < 5 || bytes[start] !== 0x2f) throw invalid('Invalid WebP lossless header.');
  const packed = bytes.readUInt32LE(start + 1);
  if ((packed >>> 29) !== 0) throw invalid('Unsupported WebP lossless version.');
  return dimensions('image/webp', (packed & 0x3fff) + 1, (packed >>> 14 & 0x3fff) + 1);
}
function webp(bytes) {
  if (bytes.length < 20 || bytes.readUInt32LE(4) + 8 !== bytes.length) throw invalid('Invalid WebP RIFF byte count.');
  let cursor = 12;
  let canvas;
  let image;
  let chunks = 0;
  while (cursor < bytes.length && ++chunks <= 1000) {
    if (cursor + 8 > bytes.length) throw invalid('Truncated WebP chunk header.');
    const tag = bytes.toString('ascii', cursor, cursor + 4);
    const size = bytes.readUInt32LE(cursor + 4);
    const start = cursor + 8;
    const end = start + size;
    const next = end + (size & 1);
    if (next > bytes.length || (size & 1) && bytes[end] !== 0) throw invalid('Invalid WebP chunk length or padding.');
    if (tag === 'VP8X') {
      if (canvas || image || cursor !== 12 || size !== 10 || bytes[start] & 0xc1 || bytes[start + 1] || bytes[start + 2] || bytes[start + 3]) throw invalid('Invalid WebP extended header.');
      if (bytes[start] & 0x02) throw invalid('Animated WebP images are not supported. Use a static PNG, JPEG or WebP image.');
      canvas = dimensions('image/webp', bytes.readUIntLE(start + 4, 3) + 1, bytes.readUIntLE(start + 7, 3) + 1);
    } else if (tag === 'VP8 ' || tag === 'VP8L') {
      if (image) throw invalid('WebP must contain exactly one static image.');
      image = tag === 'VP8 ' ? vp8(bytes, start, size) : vp8l(bytes, start, size);
    } else if (tag === 'ANIM' || tag === 'ANMF') throw invalid('Animated WebP images are not supported.');
    cursor = next;
  }
  if (cursor !== bytes.length || !image) throw invalid('A complete supported WebP image header was not found.');
  if (canvas && (canvas.width !== image.width || canvas.height !== image.height)) throw invalid('WebP canvas and encoded image dimensions do not match.');
  return canvas || image;
}

export function validateRasterHeader(input) {
  let bytes;
  try { bytes = Buffer.isBuffer(input) ? input : Buffer.from(input); } catch { throw invalid('Invalid image bytes.'); }
  if (bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return png(bytes);
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xd8) return jpeg(bytes);
  if (bytes.length >= 12 && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') return webp(bytes);
  throw invalid('An image has unsupported or invalid raster bytes.');
}
