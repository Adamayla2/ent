import { createHash, randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile, rename, stat } from 'node:fs/promises';
import path from 'node:path';
import {boundedZipRead,validateRasterHeader} from './bank-safety.mjs';

const require = createRequire(import.meta.url);
const JSZip = require('../student/jszip_min.js');
export const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;
export const MAX_BUNDLE_BYTES = 150 * 1024 * 1024;
const MAX_ENTRIES = 10000;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const TEXT_FIELDS = ['questionText','optionA','optionB','optionC','optionD','optionE','correctAnswer','explanation','subject','chapter','topic','subtopic','difficulty','book','group','referenceName','referenceEdition','referencePage'];
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
function invalid(message) { const error = new Error(message); error.status = 400; error.code = 'invalid_bank'; throw error; }
function text(value, field, max = 50000) {
  if (value == null) return '';
  if (field === 'referencePage' && typeof value === 'number') value = String(value);
  if (typeof value !== 'string' || value.length > max || value.includes('\0')) invalid(`Invalid ${field}.`);
  return value.trim();
}
function safeImagePath(value) {
  if (typeof value !== 'string' || value.length > 180 || value.includes('..') || !/^(?:images\/)?[a-zA-Z0-9][a-zA-Z0-9_.-]*\.(png|jpe?g|webp)$/i.test(value)) invalid('Images must be local PNG, JPEG or WebP paths.');
  return value;
}
function normalizeQuestions(items) {
  if (!Array.isArray(items) || !items.length || items.length > 100000) invalid('The bank must contain between 1 and 100,000 questions.');
  const seen = new Set();
  return items.map((source, index) => {
    if (!source || typeof source !== 'object' || Array.isArray(source)) invalid(`Question ${index+1} is not an object.`);
    const q = {};
    for (const field of TEXT_FIELDS) q[field] = text(source[field], `${field} in question ${index+1}`);
    if (!q.questionText || !q.optionA || !q.optionB || !/^[A-E]$/.test(q.correctAnswer) || !q['option'+q.correctAnswer]) invalid(`Question ${index+1} needs text, options A and B, and one valid nonempty answer A–E.`);
    // Classification is supplied by the publisher, never guessed from the stem.
    q.subject ||= 'Uncategorized'; q.chapter ||= 'General'; q.topic ||= 'General';
    q.tags = source.tags == null ? [] : source.tags;
    if (!Array.isArray(q.tags) || q.tags.length > 200 || q.tags.some(tag => typeof tag !== 'string' || tag.length > 500)) invalid(`Invalid tags in question ${index+1}.`);
    q.tags = [...q.tags];
    const locator=q.tags.find(tag => /^source-question:/.test(tag));
    const identity=locator && (q.referenceName || q.book) ? [q.referenceName || q.book,q.referenceEdition,locator] : [q.questionText,q.optionA,q.optionB,q.optionC,q.optionD,q.optionE];
    q.uid = source.uid == null ? 'q-'+hash(JSON.stringify(identity)).slice(0,32) : text(source.uid,'uid',200);
    if (!/^[a-zA-Z0-9][a-zA-Z0-9_.:-]{0,199}$/.test(q.uid)) invalid(`Invalid UID in question ${index+1}.`);
    if (seen.has(q.uid)) invalid(`Duplicate question UID ${q.uid}. Give distinct source questions distinct stable UIDs.`);
    seen.add(q.uid);
    q.needsReview = source.needsReview !== false;
    q.classificationApproved = source.classificationApproved === true;
    if (source.images != null && !Array.isArray(source.images)) invalid(`Invalid images in question ${index+1}.`);
    const counts = {question:0, explanation:0}, paths = new Set();
    q.images = (source.images || []).map(image => {
      const descriptor = typeof image === 'string' ? {path:image,role:'question'} : image;
      if (!descriptor || typeof descriptor !== 'object' || Array.isArray(descriptor)) invalid('Invalid image descriptor.');
      const imagePath = safeImagePath(descriptor.path), role=descriptor.role || 'question';
      if (!Object.hasOwn(counts,role) || ++counts[role]>4) invalid('At most 4 question and 4 explanation images are supported.');
      if (paths.has(imagePath)) invalid('A question references the same image twice.');
      paths.add(imagePath);
      const out = {path:imagePath,role,caption:text(descriptor.caption,'image caption',2000)};
      for (const field of ['width','height','size']) if (descriptor[field]!=null) {
        if (!Number.isSafeInteger(descriptor[field]) || descriptor[field]<=0) invalid(`Invalid image ${field}.`);
        out[field]=descriptor[field];
      }
      return out;
    });
    return q;
  });
}

export async function parseBankUpload(buffer, filename) {
  if (!Buffer.isBuffer(buffer)) buffer=Buffer.from(buffer);
  if (!buffer.length || buffer.length > MAX_UPLOAD_BYTES) invalid('Upload must be nonempty and smaller than 100 MB.');
  let source, manifest=null, zip=null;
  const suffix = path.extname(String(filename)).toLowerCase();
  if (suffix === '.json') {
    try { source=JSON.parse(buffer.toString('utf8').replace(/^\uFEFF/,'')); } catch { invalid('The uploaded JSON cannot be parsed.'); }
    if (source && source.manifest && source.database) {
      manifest=source.manifest; source=source.database;
      if (!manifest.checksum || hash(JSON.stringify(source)) !== String(manifest.checksum).toLowerCase()) invalid('The package database checksum does not match.');
    }
  } else if (suffix === '.entpkg' || suffix === '.zip') {
    try { zip=await JSZip.loadAsync(buffer,{checkCRC32:false,createFolders:false}); } catch { invalid('The update package is not a valid ZIP archive.'); }
    const entries=Object.values(zip.files);
    if (entries.length>MAX_ENTRIES) invalid('The archive contains too many entries.');
    let expanded=0;
    for (const entry of entries) {
      if (entry.dir) continue;
      const original=entry.unsafeOriginalName || entry.name;
      if (original.includes('..') || original.includes('\\') || original.startsWith('/')) invalid('Unsafe archive entry path.');
      expanded+=entry._data?.uncompressedSize || 0;
      if (expanded>MAX_BUNDLE_BYTES) invalid('The expanded archive exceeds the content limit.');
    }
    const manifestEntry=zip.file('manifest.json'), databaseEntry=zip.file('database.json');
    if (!manifestEntry || !databaseEntry) invalid('An update package needs manifest.json and database.json.');
    if (manifestEntry._data.uncompressedSize>1024*1024 || databaseEntry._data.uncompressedSize>70*1024*1024) invalid('Package metadata is too large.');
    let raw;
    try { manifest=JSON.parse((await boundedZipRead(manifestEntry,1024*1024,'manifest')).toString('utf8')); raw=(await boundedZipRead(databaseEntry,70*1024*1024,'database')).toString('utf8'); source=JSON.parse(raw); } catch(error) { invalid('Invalid package metadata: '+error.message); }
    if (!manifest.checksum || hash(raw)!==String(manifest.checksum).toLowerCase()) invalid('The package database checksum does not match.');
    if (Number(manifest.imageContentVersion || source.imageContentVersion || 0)>1) invalid('This package requires a newer image reader.');
  } else invalid('Choose a .json, .entpkg or .zip bank exported from Adam ENT Admin.');

  const questions=normalizeQuestions(Array.isArray(source) ? source : source?.questions);
  const assets=[];
  let totalImageBytes=0;
  for (const q of questions) for (const image of q.images) {
    const archivePath=image.path.startsWith('images/') ? image.path : 'images/'+image.path;
    if (!zip) invalid('Question images must be uploaded in an Admin .entpkg package with their actual bytes.');
    const entry=zip.file(archivePath);
    if (!entry || entry._data.uncompressedSize>MAX_IMAGE_BYTES) invalid(`Missing or oversized image ${archivePath}.`);
    const bytes=await boundedZipRead(entry,MAX_IMAGE_BYTES,'image');
    totalImageBytes+=bytes.length;
    if (!bytes.length || bytes.length>MAX_IMAGE_BYTES || totalImageBytes>80*1024*1024) invalid('Image bytes exceed the supported limit.');
    const raster=validateRasterHeader(bytes), mime=raster.mime, extension=path.extname(archivePath).toLowerCase();
    if ((mime==='image/png' && extension!=='.png') || (mime==='image/jpeg' && !['.jpg','.jpeg'].includes(extension)) || (mime==='image/webp' && extension!=='.webp')) invalid('Image extension does not match its actual file type.');
    if (image.size!=null && image.size!==bytes.length) invalid('Image size metadata does not match its bytes.');
    if ((image.width!=null && image.width!==raster.width) || (image.height!=null && image.height!==raster.height)) invalid('Image dimension metadata does not match its bytes.');
    image.width=raster.width; image.height=raster.height; image.size=bytes.length;
    if (Number(manifest.imageContentVersion || source.imageContentVersion || 0)>=1 && (!manifest.assetChecksums || String(manifest.assetChecksums[archivePath]).toLowerCase()!==hash(bytes))) invalid(`Image checksum mismatch: ${archivePath}.`);
    assets.push({assetKey:q.uid+'::'+image.path,mime,base64:bytes.toString('base64')});
  }
  // Lectures and other publisher assets are intentionally outside this question-bank
  // product. Reject them instead of silently dropping material the publisher expects.
  for (const name of ['lectures','flashcards','bookMeta']) if (source?.[name]?.length) invalid(`This release publishes questions and question images only; remove ${name} or publish a questions-only bank.`);
  return {questions,assets,lectures:[],flashcards:[],bookMeta:[]};
}

export async function publishBank(buffer, filename, dataDir) {
  const content=await parseBankUpload(buffer,filename);
  const publishedAt=new Date().toISOString();
  const version=publishedAt.replace(/[-:.TZ]/g,'')+'-'+randomUUID().slice(0,8);
  const bundle={schemaVersion:1,bankId:'main',version,publishedAt,...content};
  const bytes=Buffer.from(JSON.stringify(bundle));
  if (bytes.length>MAX_BUNDLE_BYTES) invalid('The finished download exceeds 150 MB. Reduce image sizes before publishing.');
  const sha256=hash(bytes);
  const metadata={id:'main',title:'Adam ENT Question Bank',version,publishedAt,questionCount:content.questions.length,imageCount:content.assets.length,sha256,bytes:bytes.length,downloadUrl:'/api/bank/download'};
  const dir=path.resolve(dataDir,'content');
  await mkdir(dir,{recursive:true});
  await writeFile(path.join(dir,sha256+'.json'),bytes,{flag:'wx'}).catch(error=>{if(error.code!=='EEXIST') throw error;});
  const temp=path.join(dir,randomUUID()+'.tmp');
  await writeFile(temp,JSON.stringify(metadata),{mode:0o600});
  await rename(temp,path.join(dir,'current.json'));
  return metadata;
}

export async function loadPublishedBank(dataDir) {
  const dir=path.resolve(dataDir,'content');
  let metadata;
  try { metadata=JSON.parse(await readFile(path.join(dir,'current.json'),'utf8')); }
  catch(error) { if(error.code==='ENOENT') return null; throw error; }
  if (!/^[a-f0-9]{64}$/.test(metadata.sha256 || '')) throw new Error('Invalid published bank metadata.');
  const bankPath=path.join(dir,metadata.sha256+'.json');
  const info=await stat(bankPath);
  if (info.size!==metadata.bytes) throw new Error('Published bank file size does not match.');
  return {metadata,path:bankPath};
}
