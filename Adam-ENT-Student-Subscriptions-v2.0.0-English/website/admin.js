(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  let token='';
  function status(message) { $('adminStatus').textContent=message; }
  async function loadStatus() {
    const response=await fetch('/api/admin/status',{headers:{Authorization:'Bearer '+token},cache:'no-store'});
    const body=await response.json();
    if(!response.ok) throw Error(body.error?.message || 'Unable to open administration. Check your key.');
    $('publisher').hidden=false;
    $('currentBank').textContent=JSON.stringify(body,null,2);
  }
  $('adminForm').addEventListener('submit',async event=>{
    event.preventDefault(); token=$('adminToken').value.trim();
    try { await loadStatus(); $('adminToken').value=''; status('Administration is ready. Choose a question bank file.'); }
    catch(error) { token=''; $('publisher').hidden=true; status(error.message); }
  });
  $('publishForm').addEventListener('submit',event=>{
    event.preventDefault();
    const file=$('bankFile').files[0];
    if(!file || !file.size || file.size>100*1024*1024) { status('Choose a valid file no larger than 100 MB.'); return; }
    if(!confirm('Publish this version to all subscribers after validation?')) return;
    const xhr=new XMLHttpRequest();
    xhr.open('POST','/api/admin/bank'); xhr.timeout=180000;
    xhr.setRequestHeader('Authorization','Bearer '+token);
    xhr.setRequestHeader('Content-Type','application/octet-stream');
    xhr.setRequestHeader('X-Filename',encodeURIComponent(file.name));
    $('publishButton').disabled=true; $('uploadProgress').hidden=false;
    status('Uploading and validating the bank…');
    xhr.upload.onprogress=event=>{ if(event.lengthComputable) $('uploadProgress').value=Math.round(100*event.loaded/event.total); };
    const finish=()=>{ $('publishButton').disabled=false; $('uploadProgress').hidden=true; };
    xhr.onerror=()=>{ finish(); status('The connection was interrupted. Publication was not confirmed. Refresh the bank status before trying again.'); };
    xhr.ontimeout=()=>{ finish(); status('The connection timed out. Refresh the bank status to check whether publication completed.'); };
    xhr.onload=async()=>{
      finish(); let body;
      try { body=JSON.parse(xhr.responseText); } catch { status('Unable to read the publication result.'); return; }
      if(xhr.status<200 || xhr.status>=300) { status(body.error?.message || 'The bank was not published.'); return; }
      status('The bank was published successfully. Subscribers can download it in the app.');
      try { await loadStatus(); } catch(error) { status(error.message); }
    };
    xhr.send(file);
  });
})();
