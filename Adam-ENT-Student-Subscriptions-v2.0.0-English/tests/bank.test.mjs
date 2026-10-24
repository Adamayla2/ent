import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {mkdtemp,readFile,rm,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {parseBankUpload,publishBank,loadPublishedBank} from '../server/bank.mjs';
const require=createRequire(import.meta.url), JSZip=require('../student/jszip_min.js');
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const q=(extra={})=>({uid:'question-one',questionText:'Test question < & > "',optionA:'A',optionB:'B',correctAnswer:'B',subject:'Otology',chapter:'Test chapter',topic:'Test topic',...extra});
const json=value=>Buffer.from(JSON.stringify(value));
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6k7sAAAAASUVORK5CYII=','base64');
async function pkg(questions,images={},extra={}) {
  const database={questions,imageContentVersion:Object.keys(images).length?1:0};
  const raw=JSON.stringify(database), zip=new JSZip();
  zip.file('database.json',raw); zip.file('manifest.json',JSON.stringify({checksum:sha(raw),imageContentVersion:database.imageContentVersion,assetChecksums:Object.fromEntries(Object.entries(images).map(([key,value])=>[key,sha(value)])),...extra}));
  for(const [key,value] of Object.entries(images)) zip.file(key,value);
  return zip.generateAsync({type:'nodebuffer',compression:'DEFLATE'});
}
test('accepts flat JSON arrays and object banks without guessing classification',async()=>{
  const first=await parseBankUpload(json([q()]),'book.json');
  const second=await parseBankUpload(json({questions:[q()]}),'book.json');
  assert.deepEqual(first,second); assert.equal(first.questions[0].topic,'Test topic');
  assert.equal(first.questions[0].questionText,'Test question < & > "');
});
test('publisher data cannot inject user progress or local database IDs',async()=>{
  const out=await parseBankUpload(json({questions:[q({id:999,performance:[1],notes:['x'],__proto__:{paid:true}})],users:[{email:'secret'}]}),'x.json');
  assert.equal(out.questions[0].id,undefined);assert.equal(out.questions[0].performance,undefined);assert.equal(out.users,undefined);
});
test('generated stable UID survives answer correction and supports source locators',async()=>{
  const source=q({uid:undefined,book:'Book',tags:['source-question:42']});
  const first=await parseBankUpload(json([source]),'x.json');
  const second=await parseBankUpload(json([{...source,correctAnswer:'A',questionText:'Corrected text'}]),'x.json');
  assert.equal(first.questions[0].uid,second.questions[0].uid);
});
test('explicit UIDs distinguish identical stems',async()=>{
  const out=await parseBankUpload(json([q(),q({uid:'question-two'})]),'x.json');assert.equal(out.questions.length,2);
});
for(const [name,value] of [
  ['empty bank',[]],['no correct option',[q({correctAnswer:'E',optionE:''})]],['multiple answers',[q({correctAnswer:'AB'})]],
  ['missing B',[q({optionB:' '})]],['duplicate UID',[q(),q()]],['malformed UID',[q({uid:'"><img src=x>'})]],
  ['bad tag type',[q({tags:'tag'})]],['remote image',[q({images:['https://host/image.png']})]],['missing image bytes',[q({images:['one.png']})]],
  ['unknown image role',[q({images:[{path:'one.png',role:'answer'}]})]]
])test('rejects '+name,async()=>assert.rejects(parseBankUpload(json(value),'x.json'),{status:400}));
test('Uncategorized is an explicit fallback',async()=>{
  const out=await parseBankUpload(json([q({subject:'',chapter:'',topic:''})]),'x.json');assert.deepEqual([out.questions[0].subject,out.questions[0].chapter,out.questions[0].topic],['Uncategorized','General','General']);
});
test('Admin image packages preserve roles, captions, checksum and raster bytes',async()=>{
  const file=await pkg([q({images:[{path:'one.png',role:'explanation',caption:'After reveal'}]})],{'images/one.png':png});
  const out=await parseBankUpload(file,'book.entpkg');
  assert.equal(out.assets[0].assetKey,'question-one::one.png');assert.equal(out.assets[0].mime,'image/png');assert.deepEqual(Buffer.from(out.assets[0].base64,'base64'),png);assert.equal(out.questions[0].images[0].role,'explanation');
});
test('rejects changed database checksums and changed image hashes',async()=>{
  await assert.rejects(parseBankUpload(await pkg([q()],{}, {checksum:'0'.repeat(64)}),'x.entpkg'),/checksum/);
  await assert.rejects(parseBankUpload(await pkg([q({images:['one.png']})],{'images/one.png':png},{assetChecksums:{'images/one.png':'0'.repeat(64)}}),'x.entpkg'),/checksum/);
});
test('rejects SVG disguised as PNG and unsafe archive paths',async()=>{
  await assert.rejects(parseBankUpload(await pkg([q({images:['one.png']})],{'images/one.png':Buffer.from('<svg onload="alert(1)"></svg>')}),'x.entpkg'),/raster|image/i);
  const zip=new JSZip();zip.file('../escape.json','{}');zip.file('database.json','{}');zip.file('manifest.json','{}');
  await assert.rejects(parseBankUpload(await zip.generateAsync({type:'nodebuffer'}),'x.entpkg'),/Unsafe/);
});
test('rejects unsupported payloads rather than silently losing non-question material',async()=>{
  await assert.rejects(parseBankUpload(json({questions:[q()],lectures:[{title:'Lecture'}]}),'x.json'),/questions.*only|remove lectures/i);
});
test('publishing is atomic; failed uploads leave the previous bank available',async t=>{
  const dir=await mkdtemp(join(tmpdir(),'adam-publish-'));t.after(()=>rm(dir,{recursive:true,force:true}));
  assert.equal(await loadPublishedBank(dir),null);
  const meta=await publishBank(json([q()]),'x.json',dir);
  const loaded=await loadPublishedBank(dir), bytes=await readFile(loaded.path);
  assert.equal(sha(bytes),meta.sha256);assert.equal(bytes.length,meta.bytes);assert.equal(JSON.parse(bytes).questions.length,1);
  await assert.rejects(publishBank(json([q({correctAnswer:'Z'})]),'x.json',dir));
  assert.equal((await loadPublishedBank(dir)).metadata.sha256,meta.sha256);
  await writeFile(loaded.path,'broken');await assert.rejects(loadPublishedBank(dir),/size/);
});
