import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';

const source = fs.readFileSync(new URL('../student/subscription-client.js', import.meta.url), 'utf8');
const pair = await webcrypto.subtle.generateKey({ name:'ECDSA', namedCurve:'P-256' }, true, ['sign','verify']);
const publicKey = await webcrypto.subtle.exportKey('jwk', pair.publicKey);
const now = Math.floor(Date.now()/1000);
const deviceId = 'device-123456789012345678901234';
const base = { iss:'adam-ent', aud:'adam-ent-student', sub:'account-1', deviceId, iat:now, exp:now+3600, subscriptionExpiresAt:now+86400, licenseVersion:1 };
let checks = 0;

async function sign(claims, header={alg:'ES256',typ:'JWT'}, privateKey=pair.privateKey) {
  const first=Buffer.from(JSON.stringify(header)).toString('base64url');
  const second=Buffer.from(JSON.stringify(claims)).toString('base64url');
  const signature=await webcrypto.subtle.sign({name:'ECDSA',hash:'SHA-256'},privateKey,Buffer.from(first+'.'+second));
  return first+'.'+second+'.'+Buffer.from(signature).toString('base64url');
}

function client(extra={}, options={}) {
  const storage=new Map(Object.entries({'adam_paid_device_id':JSON.stringify(deviceId),...extra}));
  const target=new EventTarget();
  const clock={wall:now*1000,elapsed:0};
  class ClientDate extends Date { static now() { return clock.wall; } }
  target.ADAM_CONFIG={publicKey,paymentMode:'sandbox',...options.config};
  target.location={reload(){}};
  const context={
    window:target,
    document:{visibilityState:'visible',addEventListener(){}},
    navigator:{onLine:!!options.online,userAgent:'Android'},
    localStorage:{getItem:key=>storage.has(key)?storage.get(key):null,setItem:(key,value)=>storage.set(key,String(value)),removeItem:key=>storage.delete(key)},
    Date:ClientDate,
    crypto:webcrypto,
    performance:{now:()=>clock.elapsed},
    TextEncoder,TextDecoder,Headers,FormData,AbortController,
    CustomEvent:class extends Event { constructor(type,init) { super(type); this.detail=init.detail; } },
    setTimeout,clearTimeout,setInterval(){},atob,
    fetch:options.fetch||(async()=>{throw new Error('Network unavailable');})
  };
  vm.createContext(context);
  vm.runInContext(source,context);
  return {api:target.ENTSubscription,storage,context,clock};
}

const good=await sign(base);
const saved=(patch={})=>JSON.stringify({token:'session',user:{id:'account-1',email:'student@example.test'},subscription:{active:true,expiresAt:now+86400},license:good,...patch});

let instance=client();
await instance.api.ready;
assert.equal(instance.api.currentUserId(),null); checks++;
assert.equal(instance.api.canAccess(),false); checks++;
assert.equal((await instance.api.verifyLicense(good,'account-1')).sub,'account-1'); checks++;

for(const patch of [{sub:'other'},{deviceId:'other'},{aud:'other'},{iss:'other'},{licenseVersion:2},{exp:now-1},{iat:now+1000,exp:now+2000},{exp:now+604801,subscriptionExpiresAt:now+999999},{subscriptionExpiresAt:now+30},{subscriptionExpiresAt:undefined}]) {
  await assert.rejects(instance.api.verifyLicense(await sign({...base,...patch}),'account-1')); checks++;
}
await assert.rejects(instance.api.verifyLicense(await sign(base,{alg:'none'}),'account-1')); checks++;
const parts=good.split('.'); parts[1]=Buffer.from(JSON.stringify({...base,exp:now+4000})).toString('base64url');
await assert.rejects(instance.api.verifyLicense(parts.join('.'),'account-1')); checks++;

instance=client({adam_paid_session:saved()});
await instance.api.ready;
assert.equal(instance.api.canAccess(),true); checks++;
assert.equal(instance.api.getAccountDatabaseName(),'ENTQuestionBank_paid_account-1'); checks++;

instance=client({adam_paid_session:saved({user:{id:'other'}})});
await instance.api.ready;
assert.equal(instance.api.canAccess(),false); checks++;

instance=client({adam_paid_session:saved(),'adam.ent.membership.v1.clock':JSON.stringify((now+600)*1000)});
await instance.api.ready;
assert.equal(instance.api.canAccess(),false); checks++;

instance=client({adam_paid_session:saved()}); await instance.api.ready;
instance.context.fetch=async()=>({ok:false,status:403,json:async()=>({error:{code:'subscription_expired',message:'Expired'}})});
await assert.rejects(instance.api.api('/api/bank'),error=>error.message==='Expired'&&error.code==='subscription_expired'); checks++;
assert.equal(instance.api.canAccess(),false); checks++;
instance.context.fetch=async()=>({ok:false,status:401,json:async()=>({error:{code:'unauthorized',message:'Unauthorized'}})});
await assert.rejects(instance.api.api('/api/me')); checks++;
assert.equal(instance.api.currentUserId(),null); checks++;

// Rechecking access must expire the lease even if an open screen never refreshed.
instance=client({adam_paid_session:saved()}); await instance.api.ready;
instance.clock.wall=(base.exp+1)*1000;
instance.clock.elapsed=(base.exp-base.iat+1)*1000;
assert.equal(instance.api.canAccess(),false); checks++;

// Changing unsigned account metadata never grants an entitlement.
instance=client({adam_paid_session:saved({license:null,subscription:{active:true,paid:true,expiresAt:now+999999}})});
await instance.api.ready;
assert.equal(instance.api.canAccess(),false); checks++;

// A temporary connection failure keeps an authentic, unexpired offline lease.
instance=client({adam_paid_session:saved()},{online:true}); await instance.api.ready;
assert.equal(instance.api.canAccess(),true); checks++;
assert.equal(instance.api.currentUserId(),'account-1'); checks++;

// A signed refusal after reconnection removes the previous offline entitlement.
instance=client({adam_paid_session:saved()}); await instance.api.ready;
instance.context.fetch=async()=>({ok:true,status:200,json:async()=>({user:{id:'account-1'},subscription:{active:false,expiresAt:now-1},license:null})});
await instance.api.refresh();
assert.equal(instance.api.canAccess(),false); checks++;
assert.equal(instance.storage.has('adam.ent.membership.v1.lease.account-1'),false); checks++;

// Rotation requires a deliberately updated pinned public key, never a JWT-supplied key.
const rotated=await webcrypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']);
const rotatedPublic=await webcrypto.subtle.exportKey('jwk',rotated.publicKey);
const rotatedToken=await sign(base,{alg:'ES256',typ:'JWT',jwk:rotatedPublic},rotated.privateKey);
instance=client(); await instance.api.ready;
await assert.rejects(instance.api.verifyLicense(rotatedToken,'account-1')); checks++;
instance=client({}, {config:{publicKey:rotatedPublic}}); await instance.api.ready;
assert.equal((await instance.api.verifyLicense(rotatedToken,'account-1')).sub,'account-1'); checks++;

// A rollback during the running session must stop access on the next guard call.
instance=client({adam_paid_session:saved()}); await instance.api.ready;
instance.clock.elapsed=600000;
instance.clock.wall=now*1000-600000;
assert.equal(instance.api.canAccess(),false); checks++;

// A delayed refresh cannot resurrect a session cleared by a later unauthorized response.
instance=client({adam_paid_session:saved()}); await instance.api.ready;
let resolveRefresh;
instance.context.fetch=()=>new Promise(resolve=>{resolveRefresh=resolve;});
const pendingRefresh=instance.api.refresh();
instance.context.fetch=async()=>({ok:false,status:401,json:async()=>({error:{code:'unauthorized',message:'Unauthorized'}})});
await assert.rejects(instance.api.api('/api/me'));
resolveRefresh({ok:true,status:200,json:async()=>({user:{id:'account-1'},subscription:{active:true,expiresAt:now+86400},license:good})});
await pendingRefresh;
assert.equal(instance.api.currentUserId(),null); checks++;
assert.equal(instance.api.canAccess(),false); checks++;

console.log(`Subscription client security checks passed: ${checks}`);
