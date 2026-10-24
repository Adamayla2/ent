/* Adam ENT membership client. Only a server-signed, device-bound lease grants access. */
(function () {
  'use strict';

  const config = window.ADAM_CONFIG || {};
  const STORAGE_PREFIX = 'adam.ent.membership.v1.';
  const SESSION_KEY = 'adam_paid_session';
  const DEVICE_KEY = 'adam_paid_device_id';
  const CLOCK_KEY = STORAGE_PREFIX + 'clock';
  const MAX_LEASE_SECONDS = 7 * 24 * 60 * 60;
  const CLOCK_DRIFT_MS = 5 * 60 * 1000;
  const MAX_BANK_BYTES = 150 * 1024 * 1024;
  const API_BASE = String(config.apiBaseUrl || '').replace(/\/$/, '');
  const routes = Object.assign({login:'/api/auth/login',register:'/api/auth/register',logout:'/api/auth/logout',me:'/api/me',refresh:'/api/license/refresh',devices:'/api/devices',metadata:'/api/bank',download:'/api/bank/download',account:'/api/account'}, config.apiRoutes || {});
  const state = {user:null,token:'',subscription:null,license:'',claims:null,verified:false,busy:false,refreshing:false,authMode:'login',error:'',notice:'',devices:[],metadata:null,download:null,container:null,clockBlocked:false};
  let signingKeyPromise;
  let refreshPromise;
  let authGeneration=0;
  let accountScreen=null;
  let downloadAbort;
  let bootWall = Date.now();
  let bootMonotonic = typeof performance !== 'undefined' ? performance.now() : 0;

  function readStorage(key, fallback) { try { const raw = localStorage.getItem(key); return raw === null ? fallback : JSON.parse(raw); } catch (_) { return fallback; } }
  function writeStorage(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (_) { return false; } }
  function removeStorage(key) { try { localStorage.removeItem(key); } catch (_) {} }
  function leaseKey(id) { return STORAGE_PREFIX + 'lease.' + id; }
  function bankKey(id) { return STORAGE_PREFIX + 'bank.' + id; }
  function userId(user) { return user && typeof user.id === 'string' && user.id.length <= 128 ? user.id : null; }
  function makeDeviceId() {
    let prior = readStorage(DEVICE_KEY, '');
    if (!prior) { try { prior=localStorage.getItem(DEVICE_KEY)||''; } catch (_) {} }
    if (typeof prior === 'string' && /^[a-zA-Z0-9-]{20,80}$/.test(prior)) return prior;
    const next = crypto.randomUUID ? crypto.randomUUID() : Array.from(crypto.getRandomValues(new Uint8Array(24)), b=>b.toString(16).padStart(2,'0')).join('');
    writeStorage(DEVICE_KEY, next);
    return next;
  }
  const deviceId = makeDeviceId();
  function clockNow() {
    const wall = Date.now();
    const monotonicNow = typeof performance !== 'undefined' ? bootWall + Math.max(0, performance.now() - bootMonotonic) : wall;
    const highWater = Number(readStorage(CLOCK_KEY, 0)) || 0;
    state.clockBlocked = wall + CLOCK_DRIFT_MS < highWater || wall + CLOCK_DRIFT_MS < monotonicNow;
    const current = Math.max(wall, highWater, monotonicNow);
    if (!state.clockBlocked) writeStorage(CLOCK_KEY, current);
    return current;
  }
  function emitChange() { window.dispatchEvent(new CustomEvent('ent:subscription-changed', {detail:{userId:currentUserId(),hasAccess:canAccess()}})); }
  function currentUserId() { return userId(state.user); }
  function canAccess() {
    const now = clockNow();
    return !!(state.verified && state.claims && currentUserId() && state.claims.sub === currentUserId() && state.claims.deviceId === deviceId && !state.clockBlocked && now < state.claims.exp * 1000);
  }
  function decodeBase64Url(value) {
    if (typeof value !== 'string' || !/^[A-Za-z0-9_-]+$/.test(value)) throw new Error('Invalid signed license encoding.');
    const raw = atob(value.replace(/-/g,'+').replace(/_/g,'/') + '='.repeat((4-value.length%4)%4));
    return Uint8Array.from(raw, ch=>ch.charCodeAt(0));
  }
  function decodeJsonPart(value) { return JSON.parse(new TextDecoder('utf-8', {fatal:true}).decode(decodeBase64Url(value))); }
  function expectedIssuer() { return String(config.licenseIssuer || 'adam-ent'); }
  function expectedAudience() { return String(config.licenseAudience || 'adam-ent-student'); }
  async function verifyLicense(token, accountId, nowMs, allowClockRecovery=false) {
    if (!crypto.subtle) throw new Error("Open the app over HTTPS to verify your subscription.");
    if (typeof token !== 'string' || token.length > 16000) throw new Error("Invalid subscription license.");
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error("Invalid subscription license.");
    const header = decodeJsonPart(parts[0]);
    const claims = decodeJsonPart(parts[1]);
    const issuer = expectedIssuer();
    const audience = expectedAudience();
    if (header.alg !== 'ES256' || (header.typ && header.typ !== 'JWT') || header.crit || !issuer || !audience) throw new Error("Subscription verification is not fully configured.");
    if (claims.iss !== issuer || claims.aud !== audience || claims.sub !== accountId || claims.deviceId !== deviceId || claims.licenseVersion !== 1) throw new Error("This license does not belong to this account and device.");
    if (!Number.isSafeInteger(claims.iat) || !Number.isSafeInteger(claims.exp) || claims.iat < 0 || claims.exp <= claims.iat || claims.exp - claims.iat > MAX_LEASE_SECONDS) throw new Error("The license validity period is invalid.");
    const now = nowMs === undefined ? clockNow() : nowMs;
    if (claims.iat * 1000 > now + CLOCK_DRIFT_MS || now >= claims.exp * 1000 || (state.clockBlocked && (!allowClockRecovery || Math.abs(now-claims.iat*1000)>CLOCK_DRIFT_MS))) throw new Error("Offline access has expired, or the device date and time need correcting.");
    if (!Number.isSafeInteger(claims.subscriptionExpiresAt) || claims.exp > claims.subscriptionExpiresAt) throw new Error("The license extends beyond the subscription period.");
    const jwk = config.publicKey;
    if (!jwk || jwk.kty !== 'EC' || jwk.crv !== 'P-256' || jwk.d) throw new Error("The subscription verification key is not configured.");
    if (!signingKeyPromise) signingKeyPromise = crypto.subtle.importKey('jwk', jwk, {name:'ECDSA',namedCurve:'P-256'}, false, ['verify']);
    const signature = decodeBase64Url(parts[2]);
    if (signature.byteLength !== 64 || !await crypto.subtle.verify({name:'ECDSA',hash:'SHA-256'}, await signingKeyPromise, signature, new TextEncoder().encode(parts[0]+'.'+parts[1]))) throw new Error("The subscription signature could not be verified.");
    return claims;
  }
  function invalidateLicense() {
    if (currentUserId()) removeStorage(leaseKey(currentUserId()));
    state.license=''; state.claims=null; state.verified=false;
  }
  function persistSession() {
    if (state.token && currentUserId()) writeStorage(SESSION_KEY,{token:state.token,user:state.user,subscription:state.subscription});
    else removeStorage(SESSION_KEY);
  }
  function clearSession() {
    authGeneration++;
    invalidateLicense(); removeStorage(SESSION_KEY);
    if (downloadAbort) downloadAbort.abort();
    state.user=null; state.token=''; state.subscription=null; state.devices=[]; state.metadata=null;
    state.download=null; state.error=''; state.notice=''; emitChange();
  }
  function errorMessage(error) {
    if (error && error.name === 'AbortError') return "The operation stopped. Please try again.";
    if (error && error.network) return "Cannot connect to the server. Check your internet connection and try again.";
    return error && error.message ? String(error.message) : "The operation could not be completed. Please try again.";
  }
  async function api(path, options) {
    const opts = options || {};
    const requestGeneration=authGeneration;
    const requestToken=state.token;
    const headers = new Headers(opts.headers || {});
    headers.set('Accept','application/json');
    headers.set('X-Device-Id',deviceId);
    if (state.token && opts.auth !== false) headers.set('Authorization','Bearer '+state.token);
    let body = opts.body;
    if (body !== undefined && !(body instanceof FormData) && typeof body !== 'string') { headers.set('Content-Type','application/json'); body=JSON.stringify(body); }
    const controller = new AbortController();
    const timeout = setTimeout(()=>controller.abort(), opts.timeout || 20000);
    let response;
    try { response = await fetch(API_BASE+path,{method:opts.method || 'GET',headers,body,signal:opts.signal || controller.signal,credentials:'omit',cache:'no-store',redirect:'error'}); }
    catch (cause) { const error=new Error("Cannot connect to the server."); error.network=true; error.cause=cause; throw error; }
    finally { clearTimeout(timeout); }
    if (opts.raw && response.ok) return response;
    let payload;
    try { payload=await response.json(); } catch (_) { payload={}; }
    if (!response.ok) {
      const apiError = payload.error && typeof payload.error === 'object' ? payload.error : payload;
      const err = new Error(typeof apiError.message === 'string' ? apiError.message : typeof payload.error === 'string' ? payload.error : "The request could not be completed ("+response.status+').');
      err.status=response.status; err.code=apiError.code;
      const currentRequest=requestGeneration===authGeneration && requestToken===state.token;
      if (response.status === 401 && opts.auth !== false && currentRequest) { clearSession(); repaint(); }
      else if (response.status === 403 && opts.auth !== false && !opts.preserveLicenseOn403 && currentRequest) { invalidateLicense(); emitChange(); repaint(); }
      throw err;
    }
    return payload;
  }
  async function applyAccount(payload,expectedGeneration=authGeneration) {
    if(expectedGeneration!==authGeneration)return false;
    const data=payload || {};
    if (data.token) state.token=String(data.token);
    if (data.user) {
      if (!userId(data.user)) throw new Error("The account response is invalid.");
      if (currentUserId() && currentUserId() !== data.user.id) invalidateLicense();
      state.user={id:data.user.id,email:String(data.user.email || ''),name:String(data.user.name || '')};
    }
    if (Object.prototype.hasOwnProperty.call(data,'subscription')) state.subscription=data.subscription;
    persistSession();
    if (typeof data.license === 'string' && data.license) {
      try {
        const accountId=currentUserId();
        clockNow();
        const claims=await verifyLicense(data.license,accountId,Date.now(),true);
        if(expectedGeneration!==authGeneration || currentUserId()!==accountId)return false;
        // Only a fresh authenticated server response with a verified signature
        // can recover from an earlier bad device clock. Cached leases cannot.
        if(state.clockBlocked){
          const wall=Date.now();
          if(Math.abs(wall-claims.iat*1000)>CLOCK_DRIFT_MS)throw new Error("Correct the device date and time, then verify online again.");
          bootWall=wall;bootMonotonic=typeof performance!=='undefined'?performance.now():0;
          writeStorage(CLOCK_KEY,wall);state.clockBlocked=false;
        }
        state.license=data.license; state.claims=claims; state.verified=true;
        writeStorage(leaseKey(currentUserId()),data.license);
      } catch (error) { if(expectedGeneration!==authGeneration)return false;invalidateLicense();throw error; }
    } else if (Object.prototype.hasOwnProperty.call(data,'license') || (data.subscription && data.subscription.active === false)) invalidateLicense();
    emitChange();
    return true;
  }
  async function refresh(options) {
    if (!state.token || !currentUserId()) return false;
    if (refreshPromise) return refreshPromise;
    refreshPromise=(async()=>{
      const expectedGeneration=authGeneration;
      const expectedAccount=currentUserId();
      const expectedToken=state.token;
      state.refreshing=true;
      try {
        const account=await api(routes.refresh,{method:'POST',body:{deviceId,deviceName:deviceName()}});
        if(expectedGeneration!==authGeneration || currentUserId()!==expectedAccount || state.token!==expectedToken)return canAccess();
        if(!await applyAccount(account,expectedGeneration))return canAccess();
        if (options && options.manual) state.notice=canAccess() ? "Your subscription has been verified and offline access renewed." : "Your account is ready. There is no active subscription at the moment.";
        if (options && options.manual) state.error='';
        return canAccess();
      } catch (error) {
        if(expectedGeneration!==authGeneration)return canAccess();
        if (error.status === 401 || error.status === 403) invalidateLicense();
        if (options && options.manual) state.error=errorMessage(error);
        return canAccess();
      } finally { state.refreshing=false; refreshPromise=null; emitChange(); repaint(); }
    })();
    return refreshPromise;
  }
  function deviceName() { return /Android/i.test(navigator.userAgent) ? "Android phone" : /iPhone|iPad/i.test(navigator.userAgent) ? "iOS device" : "Desktop browser"; }
  async function ensureAccess() { if (canAccess()) return true; if (navigator.onLine) await refresh(); return canAccess(); }
  async function loadAccountDetails() {
    if (!state.token) return;
    const accountId=currentUserId();
    const jobs = await Promise.allSettled([
      api(routes.devices).then(data=>{if(currentUserId()===accountId)state.devices=Array.isArray(data.devices)?data.devices:[];}),
      canAccess() ? api(routes.metadata).then(data=>{if(currentUserId()===accountId)state.metadata=validateMetadata(data);}) : Promise.resolve()
    ]);
    jobs.forEach(result=>{if(result.status==='rejected' && !result.reason.network && result.reason.status!==401 && result.reason.status!==403)state.error=errorMessage(result.reason);});
    if (currentUserId()===accountId) repaint();
  }
  function validateMetadata(raw) {
    const data=raw && raw.bank ? raw.bank : raw;
    const bytes=Number(data && (data.size === undefined ? data.bytes : data.size));
    if (!data || typeof data.sha256 !== 'string' || !/^[a-fA-F0-9]{64}$/.test(data.sha256) || !Number.isSafeInteger(bytes) || bytes<=0 || bytes>MAX_BANK_BYTES) throw new Error("The question bank download details are invalid.");
    return Object.assign({},data,{size:bytes,sha256:data.sha256.toLowerCase()});
  }
  async function downloadBank() {
    if (state.busy) return;
    const accountId=currentUserId();
    state.error=''; state.notice=''; state.busy=true; state.download={percent:0,message:"Verifying your subscription…"}; repaint();
    let downloadTimeout;
    try {
      if (!await refresh() || accountId!==currentUserId()) throw new Error("An active subscription is required to download the question bank.");
      const metadata=validateMetadata(await api(routes.metadata));
      state.metadata=metadata;
      downloadAbort=new AbortController();
      downloadTimeout=setTimeout(()=>downloadAbort && downloadAbort.abort(),120000);
      const response=await api(routes.download,{raw:true,signal:downloadAbort.signal,timeout:120000});
      const announced=Number(response.headers.get('Content-Length'));
      if (announced>MAX_BANK_BYTES || (announced>0 && announced!==metadata.size)) throw new Error("The question bank size does not match the download details.");
      const chunks=[]; let length=0;
      if (response.body && response.body.getReader) {
        const reader=response.body.getReader();
        while(true) {
          const next=await reader.read(); if(next.done)break;
          length+=next.value.byteLength;
          if(length>MAX_BANK_BYTES || length>metadata.size){await reader.cancel();throw new Error("The file exceeds the allowed size.");}
          chunks.push(next.value); state.download={percent:Math.min(94,Math.round(length/metadata.size*94)),message:"Downloading the question bank…"}; updateProgress();
        }
      } else { const bytes=new Uint8Array(await response.arrayBuffer()); length=bytes.byteLength;chunks.push(bytes); }
      if(length!==metadata.size || length>MAX_BANK_BYTES)throw new Error("The download is incomplete. Please try again.");
      const bytes=new Uint8Array(length); let offset=0;
      for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}
      state.download={percent:96,message:"Checking file integrity…"};updateProgress();
      const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');
      if(digest!==metadata.sha256)throw new Error("File integrity could not be verified. Please download it again.");
      if(accountId!==currentUserId() || !canAccess())throw new Error("The download session has expired. Sign in and try again.");
      const bundle=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
      if(!window.ENTPaidBank || typeof window.ENTPaidBank.install!=='function')throw new Error("Question bank installation is not configured in this version.");
      state.download={percent:98,message:"Installing questions and preserving your progress…"};updateProgress();
      await window.ENTPaidBank.install(bundle,metadata);
      writeStorage(bankKey(accountId),{version:metadata.version,id:metadata.id,questionCount:metadata.questionCount,installedAt:new Date().toISOString(),sha256:metadata.sha256});
      state.notice="Question bank downloaded successfully. You can now start studying.";
      state.download={percent:100,message:"Your question bank is ready"};
      window.dispatchEvent(new CustomEvent('ent:bank-installed',{detail:{userId:accountId,metadata}}));
    } catch(error) {state.error=errorMessage(error);state.download=null;}
    finally {clearTimeout(downloadTimeout);state.busy=false;downloadAbort=null;repaint();}
  }
  function el(tag,className,text) { const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node; }
  function icon(name) {
    const paths={shield:'M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6l-8-3Zm-4 9 3 3 5-6',download:'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',user:'M20 21v-2a7 7 0 0 0-14 0v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8',refresh:'M20 7v5h-5M4 17v-5h5M6 8a7 7 0 0 1 12-2l2 3M4 15l2 3a7 7 0 0 0 12-2',device:'M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm3 17h2',check:'m5 12 4 4 10-10',arrow:'M5 12h14m-6-6 6 6-6 6',book:'M12 5v16M3 3h3a8 8 0 0 1 6 2 8 8 0 0 1 6-2h3v16h-3a8 8 0 0 0-6 2 8 8 0 0 0-6-2H3V3Z',lock:'M5 11h14v10H5V11Zm3 0V7a4 4 0 0 1 8 0v4m-4 5v1',clock:'M12 8v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',logout:'M9 3H4v18h5m6-14 5 5-5 5m-7-5h12'};
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    for(const [key,value]of Object.entries({viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':'1.7','stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true'}))svg.setAttribute(key,value);
    const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',paths[name]||paths.shield);svg.append(path);return svg;
  }
  function button(text,handler,style,iconName) {const node=el('button','ent-button '+(style||''));node.type='button';if(iconName)node.append(icon(iconName));node.append(el('span','',text));node.addEventListener('click',handler);return node;}
  function formatDate(value) {if(!value)return '—';const date=new Date(typeof value==='number'?value*1000:value);return Number.isFinite(date.getTime())?new Intl.DateTimeFormat('en-GB',{year:'numeric',month:'long',day:'numeric'}).format(date):'—';}
  function sizeLabel(bytes) {return new Intl.NumberFormat('en-GB',{maximumFractionDigits:1}).format(bytes/1048576)+" MB";}
  function field(label,type,name,autocomplete) {const wrap=el('label','ent-field');wrap.append(el('span','ent-field-label',label));const input=el('input');input.type=type;input.name=name;input.autocomplete=autocomplete;input.required=true;input.dir='ltr';if(type==='password')input.minLength=10;wrap.append(input);return {wrap,input};}
  function plansCard() {
    const card=el('section','ent-card ent-plans');card.append(el('h2','ent-card-title',"Subscription plans"));
    const grid=el('div','ent-plans-grid');
    for(const plan of [{title:"Three months",price:'15,000',caption:"IQD / 3 months"},{title:"One year",price:'50,000',caption:"IQD / year",tag:"Save 10,000 IQD"}]){
      const box=el('div','ent-plan'+(plan.tag?' ent-plan-featured':''));box.append(el('h3','',plan.title));if(plan.tag)box.append(el('span','ent-plan-tag',plan.tag));const price=el('div','ent-price',plan.price);price.dir='ltr';box.append(price,el('p','ent-subtle',plan.caption));grid.append(box);
    }
    card.append(grid,el('p','ent-caption',"Sign in with the account linked to your subscription. Your subscription status updates after payment is confirmed."));return card;
  }
  function authCard() {
    const registering=state.authMode==='register';const card=el('section','ent-card ent-auth');
    const title=el('div','ent-card-heading');title.append(icon('user'),el('h2','ent-card-title',registering?"Create your student account":"Welcome back"));card.append(title,el('p','ent-subtle',"Sign in with the account linked to your subscription."));
    const form=el('form','ent-form');let name;
    if(registering){name=field("Name",'text','name','name');name.input.maxLength=100;form.append(name.wrap);}
    const email=field("Email address",'email','email','email');email.input.maxLength=254;
    const password=field("Password",'password','password',registering?'new-password':'current-password');
    if(!registering)password.input.removeAttribute('minlength');
    form.append(email.wrap,password.wrap);
    if(registering)form.append(el('p','ent-caption',"Use a password with at least 10 characters. Creating an account does not activate a paid subscription."));
    const submit=el('button','ent-button ent-primary',state.busy?"Connecting…":registering?"Create account":"Sign in");submit.type='submit';submit.disabled=state.busy;form.append(submit);
    form.addEventListener('submit',async(event)=>{
      event.preventDefault();if(state.busy||!form.reportValidity())return;
      state.busy=true;state.error='';state.notice='';submit.disabled=true;submit.textContent="Connecting…";
      const expectedGeneration=++authGeneration;
      try{
        const payload=await api(registering?routes.register:routes.login,{method:'POST',auth:false,body:{email:email.input.value.trim(),password:password.input.value,name:name?name.input.value.trim():undefined,deviceId,deviceName:deviceName()}});
        if(!await applyAccount(payload,expectedGeneration))return;password.input.value='';state.notice="Opening your account and preparing your personal study space…";
        window.dispatchEvent(new CustomEvent('ent:account-changed',{detail:{userId:currentUserId()}}));
        repaint();
        window.location.reload();
      }catch(error){state.error=errorMessage(error);}
      finally{password.input.value='';state.busy=false;repaint();}
    });
    card.append(form,button(registering?"Already have an account? Sign in":"New here? Create an account",()=>{state.authMode=registering?'login':'register';state.error='';repaint();},'ent-text-button'));
    return card;
  }
  function subscriptionEnd(){return state.subscription && (state.subscription.expiresAt || state.subscription.endsAt) || state.claims && state.claims.subscriptionExpiresAt;}
  function accountCard() {
    const active=canAccess();const card=el('section','ent-card ent-account');const head=el('div','ent-account-head');
    const info=el('div');info.append(el('p','ent-eyebrow',"Student account"),el('h2','ent-account-name',state.user.name||"Adam ENT student"),el('p','ent-account-email',state.user.email));
    const badge=el('span','ent-status '+(active?'ent-status-active':'ent-status-muted'),active?"Active subscription":"No active subscription");head.append(info,badge);card.append(head);
    const facts=el('div','ent-facts');
    for(const fact of [{label:"Subscription expires",value:formatDate(subscriptionEnd()),symbol:'clock'},{label:"Offline access valid until",value:state.claims?formatDate(state.claims.exp):"Connect to the internet to verify",symbol:'shield'}]){const row=el('div','ent-fact');row.append(icon(fact.symbol),el('span','ent-subtle',fact.label),el('strong','',fact.value));facts.append(row);}
    card.append(facts,el('p','ent-caption',active?"Study offline until the date shown, within your subscription period. Connect to the internet to renew offline access.":"Your progress and notes are saved. Access to questions requires an active subscription and account verification."));
    const actions=el('div','ent-actions');const sync=button(state.refreshing?"Verifying…":"Refresh subscription status",async()=>{await refresh({manual:true});loadAccountDetails();},'ent-secondary','refresh');sync.disabled=state.refreshing||state.busy;
    const logout=button("Sign out",async()=>{if(state.busy)return;try{await api(routes.logout,{method:'POST',body:{deviceId}});}catch(_){}clearSession();repaint();window.dispatchEvent(new CustomEvent('ent:account-changed',{detail:{userId:null}}));window.location.reload();},'ent-text-button','logout');logout.disabled=state.busy;actions.append(sync,logout);card.append(actions);return card;
  }
  function downloadCard() {
    const card=el('section','ent-card ent-bank');const head=el('div','ent-card-heading');head.append(icon('book'),el('h2','ent-card-title',"Question bank"));card.append(head);
    const installed=readStorage(bankKey(currentUserId()),null);
    card.append(el('p','ent-subtle',installed?"Your question bank is saved on this device. Download the latest version while keeping your progress.":"Download the questions to your device, then continue studying offline."));
    if(state.metadata){const meta=el('div','ent-bank-meta');if(state.metadata.questionCount!==undefined)meta.append(el('span','',new Intl.NumberFormat('en-GB').format(state.metadata.questionCount)+" questions"));meta.append(el('span','',sizeLabel(state.metadata.size)));if(state.metadata.version)meta.append(el('span','',"Version "+state.metadata.version));card.append(meta);}
    if(installed)card.append(el('p','ent-caption',"Last download: "+formatDate(installed.installedAt)));
    const progress=el('div','ent-download-state');progress.dataset.entProgress='';card.append(progress);
    const download=button(state.busy?"Downloading…":installed?"Download latest version":"Download question bank",downloadBank,'ent-primary','download');download.disabled=state.busy||!canAccess();card.append(download);
    if(!canAccess())card.append(el('p','ent-caption',"Downloads are available after your subscription is confirmed and verified."));
    return card;
  }
  function devicesCard() {
    const card=el('section','ent-card ent-devices');const head=el('div','ent-card-heading');head.append(icon('device'),el('h2','ent-card-title',"Your devices"));card.append(head,el('p','ent-subtle',"Use your account on up to two devices. Remove an old device when needed."));
    const list=el('ul','ent-device-list');
    if(!state.devices.length)list.append(el('li','ent-caption',"Connect to the internet to view devices linked to your account."));
    for(const item of state.devices){const id=String(item.id||item.deviceId||'');const row=el('li','ent-device-row');const detail=el('div');detail.append(el('strong','',String(item.name||item.deviceName||"Student device")),el('p','ent-caption',id===deviceId?"This device":"Last used: "+formatDate(item.lastSeenAt||item.lastSeen)));row.append(icon('device'),detail);
      const revoke=button("Remove",async()=>{if(state.busy)return;revoke.disabled=true;try{await api(routes.devices+'/'+encodeURIComponent(id),{method:'DELETE'});if(id===deviceId){invalidateLicense();state.notice="This device has been deactivated.";emitChange();}else state.notice="The device has been removed.";await loadAccountDetails();}catch(error){state.error=errorMessage(error);}finally{repaint();}},'ent-device-remove');revoke.disabled=state.busy;row.append(revoke);list.append(row);}
    card.append(list);return card;
  }
  function deleteAccountCard(){
    const details=el('details','ent-card ent-danger-zone');details.append(el('summary','',"Account management and deletion"));
    details.append(el('p','ent-caption',"Account deletion is permanent. Content access will end, and your account data and local study progress will be deleted. Other student accounts on this device will be unaffected."));
    const form=el('form','ent-form');const password=field("Enter your password to confirm deletion",'password','deletePassword','current-password');password.input.removeAttribute('minlength');const confirm=el('label','ent-confirm');const checkbox=el('input');checkbox.type='checkbox';checkbox.required=true;confirm.append(checkbox,el('span','',"I understand that account deletion is permanent and agree to delete my account data."));
    const submit=el('button','ent-button ent-danger',"Delete account permanently");submit.type='submit';submit.disabled=state.busy;form.append(password.wrap,confirm,submit);
    form.addEventListener('submit',async(event)=>{event.preventDefault();if(state.busy||!form.reportValidity())return;state.busy=true;submit.disabled=true;const id=currentUserId();try{await api(routes.account,{method:'DELETE',body:{password:password.input.value,deviceId}});removeStorage(bankKey(id));const cleanupPromises=[];window.dispatchEvent(new CustomEvent('ent:account-deleted',{detail:{userId:id,databaseName:databaseNameFor(id),cleanupPromises}}));await Promise.allSettled(cleanupPromises);clearSession();state.notice="Account deleted.";}catch(error){state.error=errorMessage(error);}finally{password.input.value='';state.busy=false;repaint();}});
    details.append(form);return details;
  }
  function updateProgress() {
    if(!state.container || state.container.firstElementChild!==accountScreen)return;const node=accountScreen.querySelector('[data-ent-progress]');if(!node)return;node.replaceChildren();
    if(!state.download)return;
    const label=el('p','ent-caption',state.download.message+' '+state.download.percent+'%');const progress=el('progress');progress.max=100;progress.value=state.download.percent;progress.setAttribute('aria-label',state.download.message);node.append(label,progress);
  }
  function repaint(){if(state.container && state.container.isConnected && state.container.firstElementChild===accountScreen)renderAccount(state.container,{load:false});}
  async function renderAccount(container,options){
    if(!container || typeof container.replaceChildren!=='function')return;
    state.container=container;
    const screen=el('section','ent-membership');screen.dir='ltr';screen.lang='en';
    const hero=el('header','ent-member-hero');const lock=el('div','ent-hero-icon');lock.append(icon('shield'));const copy=el('div');copy.append(el('p','ent-eyebrow',"ADAM ENT · STUDENT SPACE"),el('h1','',"Your studies start here"),el('p','ent-hero-description',"Your question bank, with study progress saved on this device."));hero.append(lock,copy);screen.append(hero);
    if(config.paymentMode==='sandbox'){const demo=el('div','ent-banner ent-demo');demo.setAttribute('role','status');demo.append(el('strong','',"Test version — real payments are disabled"),el('p','',"This environment does not accept money. Test activation is available only on the test website."));screen.append(demo);}
    if(!navigator.onLine){const offline=el('div','ent-banner ent-offline');offline.append(icon('clock'),el('p','',canAccess()?"You are offline. You can continue studying while your saved offline access is valid.":"You are offline. Connect to verify your account and subscription."));screen.append(offline);}
    if(state.clockBlocked)screen.append(el('div','ent-banner ent-error',"The device date and time are incorrect. Correct them, then connect to verify your subscription."));
    if(state.error){const alert=el('div','ent-banner ent-error',state.error);alert.setAttribute('role','alert');screen.append(alert);}
    if(state.notice){const notice=el('div','ent-banner ent-success',state.notice);notice.setAttribute('role','status');screen.append(notice);}
    const grid=el('div','ent-member-grid');const primary=el('div','ent-member-primary');const side=el('aside','ent-member-side');
    if(currentUserId()){primary.append(accountCard(),downloadCard());side.append(devicesCard(),plansCard());}
    else {primary.append(authCard());side.append(plansCard());const feature=el('section','ent-card ent-features');for(const text of ["Download questions in the app","Study and take exams offline","Keep your progress and notes after your subscription expires"]){const row=el('p');row.append(icon('check'),el('span','',text));feature.append(row);}side.append(feature);}
    grid.append(primary,side);screen.append(grid);
    if(currentUserId())screen.append(deleteAccountCard());
    const footer=el('p','ent-member-footnote');footer.append(icon('lock'),el('span','',"Subscriptions are verified by the server. A pending payment does not grant access to questions."));screen.append(footer);
    container.replaceChildren(screen);accountScreen=screen;updateProgress();
    if(!(options && options.load===false) && currentUserId())loadAccountDetails();
  }
  function databaseNameFor(id){return 'ENTQuestionBank_paid_'+String(id||'guest');}
  async function boot(){
    const saved=readStorage(SESSION_KEY,null);
    if(saved && typeof saved.token==='string' && saved.token.length<16000 && userId(saved.user)){
      state.token=saved.token;state.user=saved.user;state.subscription=saved.subscription||null;
      const lease=readStorage(leaseKey(currentUserId()),'') || saved.license || '';
      if(lease)try{state.claims=await verifyLicense(lease,currentUserId());state.license=lease;state.verified=true;}catch(_){invalidateLicense();}
      if(navigator.onLine)await refresh();
    }
    clockNow();return canAccess();
  }
  const ready=boot();
  const publicApi={ready,canAccess,currentUserId,renderAccount,ensureAccess,refresh,downloadBank,api,getAccountDatabaseName:()=>databaseNameFor(currentUserId()),getDeviceId:()=>deviceId,getState:()=>({user:state.user?Object.assign({},state.user):null,subscription:state.subscription?Object.assign({},state.subscription):null,hasAccess:canAccess(),offlineUntil:state.claims?state.claims.exp:null}),verifyLicense};
  window.ENTSubscription=Object.freeze(publicApi);
  window.addEventListener('online',()=>{refresh();repaint();});
  window.addEventListener('offline',repaint);
  window.addEventListener('storage',event=>{if(event.key===SESSION_KEY)window.location.reload();});
  window.addEventListener('focus',()=>{if(navigator.onLine)refresh();else{emitChange();repaint();}});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){if(navigator.onLine)refresh();else{emitChange();repaint();}}});
  setInterval(()=>{if(document.visibilityState==='visible'){if(navigator.onLine)refresh();else{emitChange();repaint();}}},60000);
})();
