(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  $('deleteAccountForm').addEventListener('submit',async event=>{
    event.preventDefault();
    let session,device;
    try { session=JSON.parse(localStorage.getItem('adam_paid_session')); device=JSON.parse(localStorage.getItem('adam_paid_device_id')); } catch {}
    if(!session?.token || !session.user?.id || !device) { $('deleteStatus').textContent='Sign in on the home page first, then return to this page.';return; }
    if(!$('deleteConfirm').checked || !confirm('Permanently delete your account and subscription?')) return;
    $('deleteSubmit').disabled=true;
    try {
      const response=await fetch('/api/account',{method:'DELETE',headers:{'Content-Type':'application/json',Authorization:'Bearer '+session.token,'X-Device-Id':device},body:JSON.stringify({password:$('deletePassword').value})});
      const body=await response.json();
      if(!response.ok)throw Error(body.error?.code==='invalid_password'?'Incorrect password.':'Unable to delete your account. Check your password or sign in again.');
      const id=session.user.id;
      localStorage.setItem('adam_account_deleted:'+id,'1');
      for(const key of Object.keys(localStorage)) if(key==='adam_paid_session' || key.startsWith('adam_progress:'+id+':') || key==='adam.ent.membership.v1.lease.'+id || key==='adam.ent.membership.v1.bank.'+id) localStorage.removeItem(key);
      indexedDB.deleteDatabase('ENTQuestionBank_paid_'+id);
      $('deleteAccountForm').hidden=true; $('deleteStatus').textContent='Your account and its data have been deleted from the service.';
    } catch(error) { $('deleteStatus').textContent=error.message; }
    finally { $('deletePassword').value=''; $('deleteSubmit').disabled=false; }
  });
})();
