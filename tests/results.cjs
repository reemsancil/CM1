const assert=require('node:assert/strict');
const fs=require('node:fs');
const {JSDOM}=require('jsdom');
(async()=>{
const dom=new JSDOM(fs.readFileSync('teacher.html','utf8'),{url:'https://cm1.example/teacher.html',runScripts:'outside-only'});
const w=dom.window,d=w.document;let posted;w.AbortSignal.timeout=()=>undefined;
w.fetch=async(url,options)=>{posted=JSON.parse(options.body);return {ok:false,status:409,json:async()=>({code:'23505'})}};
w.eval(fs.readFileSync('results-api.js','utf8'));await w.ResultsAPI.submit({id:'same-id'});assert.equal(posted.id,'same-id');
w.fetch=async()=>({ok:false,status:403,json:async()=>({})});await assert.rejects(()=>w.ResultsAPI.submit({id:'same-id'}));
const rows=[{student_name:'Zoe',class_section:'CM1 A',game:'CM1 · Grammar',exercise:'Capitalization',score:8,total:10,completed_at:'2026-10-08T09:00:00Z'},{student_name:'<Alice>',class_section:'CM1 A',game:'CM1 · Grammar',exercise:'Capitalization',score:9,total:10,completed_at:'2026-10-08T09:00:00Z'},{student_name:'CE2 student',class_section:'CE2 A',game:'CE2',exercise:'Rhymes',score:5,total:5,completed_at:'2026-10-08T09:00:00Z'},{student_name:'Dan',class_section:'CM1 D',game:'CM1 · Grammar',exercise:'Full Stop',score:10,total:10,completed_at:'2026-10-08T09:00:00Z'}];
w.ResultsAPI={teacherId:'teacher',signIn:async()=>({user:{id:'teacher'},access_token:'token',expires_in:3600}),results:async()=>rows,signOut:async()=>{}};
w.eval(fs.readFileSync('teacher.js','utf8'));assert.equal(d.querySelector('#teacher-results').hidden,true);assert.equal(d.querySelectorAll('td').length,0);
d.querySelector('#teacher-email').value='test@example.com';d.querySelector('#teacher-password').value='test';d.querySelector('#teacher-login').dispatchEvent(new w.Event('submit',{cancelable:true}));await new Promise(r=>setTimeout(r,0));
assert.equal(d.querySelector('#teacher-results').hidden,false);assert.deepEqual([...d.querySelectorAll('#section-results h2')].map(x=>x.textContent),['CM1 A (2 submissions)','CM1 D (1 submissions)']);assert.equal(d.querySelector('tbody td').textContent,'<Alice>');assert(!d.querySelector('#section-results alice'));assert(!d.querySelector('#section-results').textContent.includes('CE2 student'));assert.equal(d.querySelector('#download-csv').disabled,false);
d.querySelector('#sign-out').click();assert.equal(d.querySelector('#teacher-results').hidden,true);assert.equal(d.querySelectorAll('td').length,0);
dom.window.close();console.log('Passed: duplicate acknowledgment; API rejection; teacher login gating; CM1 section grouping; name sorting; safe text; sign-out.');
})().catch(error=>{console.error(error);process.exitCode=1});
