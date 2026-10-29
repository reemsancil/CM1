// Tokens stay in the teacher page. Only the authenticated lesson response enters the frame.
window.TeacherPreview = (() => {
  const panel = document.querySelector('#directions-preview');
  const frame = document.querySelector('#directions-preview-frame');
  let generation = 0;
  function clear(){generation++;frame.removeAttribute('srcdoc');panel.hidden=true;}
  async function open(getToken){
    const run=++generation;
    const token=await getToken();
    if(!token || run!==generation) return;
    const response=await fetch('/.netlify/functions/directions-preview',{
      headers:{Authorization:`Bearer ${token}`},cache:'no-store',signal:AbortSignal.timeout(20000),
    });
    if(!response.ok) throw new Error('Preview unavailable');
    const data=await response.json();
    if(run!==generation)return;
    if(typeof data.script!=='string')throw new Error('Preview unavailable');
    const script=data.script.replace(/<\/script/gi,'<\\/script');
    frame.srcdoc=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/styles.css"></head><body><main id="app"></main><script>window.CM1_TEACHER_PREVIEW=true;</script><script src="/student-roster.js"></script><script src="/data.js"></script><script src="/directions.js"></script><script>${script}</script><script src="/app.js"></script><script>document.addEventListener('click',event=>{const link=event.target.closest('a[href^="#"]');if(link){event.preventDefault();location.hash=link.getAttribute('href');}});location.hash='topic/directions';</script></body></html>`;
    panel.hidden=false;
    panel.scrollIntoView({behavior:'smooth',block:'start'});
  }
  document.querySelector('#close-directions-preview').addEventListener('click',clear);
  return {open,clear};
})();
