(() => {
  'use strict';
  const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
  const requestResult = request => new Promise((resolve,reject)=>{
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error || new Error('Local database read failed.'));
  });
  let installing=false;
  async function install(bundle,metadata) {
    if (installing) throw new Error('Another download is being installed.');
    const account=window.ENTSubscription.currentUserId();
    if (!account || !window.ENTSubscription.canAccess()) throw new Error('An active subscription is required to download questions.');
    await db.ensureReady();
    if (account!==window.ENTPaidStorage.accountId()) throw new Error('Reopen the app to finish signing in to your account.');
    if (!bundle || bundle.schemaVersion!==1 || bundle.bankId!==metadata.id || bundle.version!==metadata.version || !Array.isArray(bundle.questions) || !bundle.questions.length || bundle.questions.length!==metadata.questionCount || !Array.isArray(bundle.assets) || bundle.assets.length!==metadata.imageCount) throw new Error('The question bank does not match its download details.');
    installing=true;
    try {
      const incomingUids=new Set(), verifiedAssets=new Map();
      for (const asset of bundle.assets) {
        if (!asset || typeof asset.assetKey!=='string' || typeof asset.base64!=='string' || asset.base64.length>Math.ceil(MAX_IMAGE_BYTES*4/3)+8 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(asset.base64) || !['image/png','image/jpeg','image/webp'].includes(asset.mime) || verifiedAssets.has(asset.assetKey)) throw new Error('The question bank contains an invalid image.');
        const raw=atob(asset.base64), bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));
        if (!bytes.length || bytes.length>MAX_IMAGE_BYTES) throw new Error('This image size is not supported.');
        verifiedAssets.set(asset.assetKey,new Blob([bytes],{type:asset.mime}));
      }
      const questions=[];
      for (const source of bundle.questions) {
        if (!source || typeof source.uid!=='string' || !/^[a-zA-Z0-9][a-zA-Z0-9_.:-]{0,199}$/.test(source.uid) || incomingUids.has(source.uid) || typeof source.questionText!=='string' || !source.questionText.trim() || !/^[A-E]$/.test(source.correctAnswer) || typeof source.optionA!=='string' || !source.optionA.trim() || typeof source.optionB!=='string' || !source.optionB.trim() || typeof source['option'+source.correctAnswer]!=='string' || !source['option'+source.correctAnswer].trim()) throw new Error('The question bank contains an invalid question.');
        incomingUids.add(source.uid);
        const q={...source}; delete q.id;
        normalizeQuestionReferenceMetadata(q);
        normalizeQuestionClassification(q,{readNested:false,infer:false});
        if (!Array.isArray(q.images) || q.images.length>8) throw new Error('The question attachments are invalid.');
        for (const image of q.images) {
          const imagePath=window.__entUpdatePkg.questionImagePath(image);
          const blob=verifiedAssets.get(q.uid+'::'+imagePath);
          if (!blob) throw new Error('A question image is missing.');
          await window.__entUpdatePkg.validateRasterImage(blob,image);
        }
        questions.push(q);
      }
      if (account!==window.ENTSubscription.currentUserId() || !window.ENTSubscription.canAccess()) throw new Error('Your account changed or your subscription expired during the download.');
      for (const [assetKey,blob] of verifiedAssets) {
        const previous=await requestResult(db.db.transaction('assets','readonly').objectStore('assets').get(assetKey));
        if (previous?.blob instanceof Blob && previous.blob.size) {
          const digest=async value=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await value.arrayBuffer()))).join(',');
          if (await digest(previous.blob)!==await digest(blob)) throw new Error('An image has changed under the same file name. The administrator must rename replacement images and publish the bank again.');
        }
      }
      const local=await requestResult(db.db.transaction('questions','readonly').objectStore('questions').getAll());
      const byUid=new Map(local.filter(q=>q.uid).map(q=>[q.uid,q]));
      let added=0, updated=0;
      const now=new Date().toISOString();
      await new Promise((resolve,reject)=>{
        const tx=db.db.transaction(['questions','assets','settings'],'readwrite');
        tx.oncomplete=resolve;
        tx.onerror=()=>reject(tx.error || new Error('The question bank could not be saved.'));
        tx.onabort=()=>reject(tx.error || new Error('Saving the question bank was cancelled.'));
        try {
          const store=tx.objectStore('questions');
          for (const q of questions) {
            const old=byUid.get(q.uid);
            if (old) { store.put({...q,id:old.id,dateAdded:old.dateAdded || now,updatedAt:now}); updated++; }
            else { store.add({...q,dateAdded:now,updatedAt:now}); added++; }
          }
          for (const [assetKey,blob] of verifiedAssets) tx.objectStore('assets').put({assetKey,blob});
          tx.objectStore('settings').put({key:'paid_bank_install',value:{...metadata,installedAt:now,accountId:account}});
        } catch(error) { tx.abort(); reject(error); }
      });
      db._invalidateCache();
      if (typeof FilterCache!=='undefined') FilterCache.clear?.();
      if (typeof SearchIndex!=='undefined') SearchIndex.invalidate?.();
      window.dispatchEvent(new CustomEvent('ent:bank-installed',{detail:{metadata,added,updated}}));
      return {added,updated,questionCount:questions.length};
    } finally { installing=false; }
  }
  async function installed() {
    await db.ensureReady();
    return db.getSetting('paid_bank_install',null);
  }
  window.ENTPaidBank=Object.freeze({install,installed});

  function lockOpenContent() {
    if (window.ENTSubscription.canAccess()) return;
    if (AppState.examTimer) { clearInterval(AppState.examTimer); AppState.examTimer=null; }
    // Preserve the account's exam and answers before closing its view.
    if (typeof _doSaveSession==='function') _doSaveSession();
    document.getElementById('modalOverlay')?.classList.add('hidden');
    document.getElementById('entResumePanel')?.style.setProperty('display','none');
    if (typeof QuestionImages!=='undefined') QuestionImages.closeViewer(true);
    if (AppState._questionScroller?.destroy) AppState._questionScroller.destroy();
    renderViewSafely('account');
  }
  window.addEventListener('ent:subscription-changed',()=>{
    // A refresh with a still-valid lease must not interrupt an active exam.
    if (typeof AppState!=='undefined') lockOpenContent();
  });
  window.addEventListener('ent:account-deleted',event=>{
    const id=event.detail?.userId || event.detail?.id || window.ENTPaidStorage.accountId();
    if (!id) return;
    const cleanup=(async()=>{
      window.ENTPaidStorage.markDeleted(id);
      if (id===window.ENTPaidStorage.accountId()) db.db?.close();
      for (const key of Object.keys(localStorage)) if (key.startsWith('adam_progress:'+id+':')) localStorage.removeItem(key);
      await new Promise((resolve,reject)=>{
        const request=indexedDB.deleteDatabase(event.detail?.databaseName || 'ENTQuestionBank_paid_'+id);
        request.onsuccess=resolve; request.onerror=()=>reject(request.error);
        // Other tabs receive versionchange and close. If a tab cannot close, the
        // delete request remains pending until it does; account access is revoked.
        request.onblocked=resolve;
      });
    })();
    event.detail?.cleanupPromises?.push(cleanup);
  });
  window.addEventListener('load',()=>{
    let wasAllowed=window.ENTSubscription.canAccess();
    setInterval(()=>{
      const allowed=window.ENTSubscription.canAccess();
      if (wasAllowed && !allowed) lockOpenContent();
      wasAllowed=allowed;
    },1000);
    if (!location.hostname.endsWith('androidplatform.net') && 'serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js').catch(()=>{});
    const icon=document.getElementById('btnSettings');
    if (icon) { icon.title='Account and subscription'; icon.setAttribute('aria-label','Account and subscription'); }
  });
})();
