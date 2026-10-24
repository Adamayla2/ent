/* Personal progress is scoped to the account opened at startup. Auth storage is
   managed separately by subscription-client.js. No publisher data clears it. */
(() => {
  'use strict';
  let account = null;
  let bound = false;
  let deleted = false;
  function prefix() { return 'adam_progress:' + (account || 'guest') + ':'; }
  window.ENTPaidStorage = Object.freeze({
    bindAccount() {
      if (!bound) { account = window.ENTSubscription?.currentUserId() || null; bound = true; }
      return account;
    },
    getItem(key) { try { return localStorage.getItem(prefix()+key); } catch { return null; } },
    setItem(key,value) {
      if (deleted || (account && localStorage.getItem('adam_account_deleted:'+account))) return;
      localStorage.setItem(prefix()+key,String(value));
    },
    removeItem(key) { localStorage.removeItem(prefix()+key); },
    keys() { return Object.keys(localStorage).filter(key=>key.startsWith(prefix())).map(key=>key.slice(prefix().length)); },
    accountId() { return account; },
    markDeleted(id) {
      localStorage.setItem('adam_account_deleted:'+id,'1');
      if (id===account) deleted=true;
    }
  });
  const icon=path=>'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+path+'</svg>';
  window.ENTPaidThemeIcon=dark=>icon(dark?'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/>':'<path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/>');
  window.addEventListener('DOMContentLoaded',()=>{
    const theme=document.getElementById('btnDarkMode');
    if(theme && !theme.querySelector('svg')) theme.innerHTML=window.ENTPaidThemeIcon(document.body.classList.contains('dark-mode'));
    const search=document.getElementById('btnSearch');
    if(search) search.innerHTML=icon('<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>');
    const account=document.getElementById('btnSettings');
    if(account) account.innerHTML=icon('<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>');
  });
})();
