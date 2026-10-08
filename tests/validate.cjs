(async()=>{
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {LANDMARKS,TOPICS,GAMES}=require('../data.js');
assert.equal(TOPICS.length,7);assert.equal(GAMES.length,16);assert.equal(LANDMARKS.length,12);
for(const g of GAMES){assert(g.questions.length>=8,g.id);for(const q of g.questions){assert(q.prompt&&q.answer);if(g.type!=='match')assert(q.choices.includes(q.answer),g.id+': '+q.prompt);assert.equal(new Set(q.choices).size,q.choices.length);}}
const placeTopic=TOPICS.find(t=>t.id==='place');assert(!placeTopic.learn.includes('near'));
const placeGames=GAMES.filter(g=>g.topic==='place');assert.equal(placeGames.length,2);assert(placeGames.some(g=>g.id==='position-sentences'));assert(!GAMES.some(g=>g.id==='map'));
for(const g of placeGames){for(const q of g.questions){assert(q.visual.startsWith('position:'));assert(![q.prompt,q.answer,...q.choices].some(text=>/\bnear\b|\bmap\b/i.test(text)));}}
const {JSDOM}=require('jsdom');
const dom=new JSDOM(fs.readFileSync('index.html','utf8'),{url:'https://cm1.example/',runScripts:'outside-only'});
const w=dom.window;w.scrollTo=()=>{};w.eval(fs.readFileSync('data.js','utf8')+'\n'+fs.readFileSync('app.js','utf8')+'\nwindow.testAPI={GAMES,TOPICS,getState:()=>state,route,shuffle};');
const submitted=[];w.ResultsAPI={submit:async record=>{submitted.push(record);}};
const d=w.document,api=w.testAPI;
assert.equal(d.querySelectorAll('.topic').length,7);
assert.equal(d.querySelectorAll('.section').length,2);
assert.equal(d.querySelector('.home-heading h1').textContent,'CM1 English Games');
assert.equal(d.querySelector('.teacher-name').textContent,"Mrs. Reem's English Class");
assert.equal(d.querySelector('.home-heading p:last-child').textContent,'Practice your English and have fun!');
assert.deepEqual([...d.querySelectorAll('.section-head h2')].map(x=>x.textContent),['VOCABULARY','GRAMMAR']);
assert.deepEqual([...d.querySelectorAll('.home-topic h3')].map(x=>x.textContent),['London Landmarks','Family Tree','Prepositions of Place','Subject Pronouns','Object Pronouns','Verb to Be','Capitalization and Punctuation']);
assert.equal(d.querySelectorAll('.homepage a[href^="#game/"]').length,0);
assert.equal(d.querySelectorAll('.london-banner svg[role="img"]').length,1);
assert.equal(d.querySelector('.london-banner').textContent,'');
assert.equal(d.querySelectorAll('.home-topic .home-icon svg').length,7);
assert(d.body.classList.contains('home-view'));

const topicLinks=[...d.querySelectorAll('.home-topic')].map(a=>a.getAttribute('href'));
const gameLinks=[];
for(const link of topicLinks){w.history.replaceState(null,'','#'+(link).replace(/^#/,''));api.route();const t=TOPICS.find(t=>link==='#topic/'+t.id);assert(t);assert(!d.body.classList.contains('home-view'));const links=[...d.querySelectorAll('.game-list .topic')].map(a=>a.getAttribute('href'));assert.equal(links.length,GAMES.filter(g=>g.topic===t.id).length);assert(d.querySelector('header a[href="#"]'));assert(d.querySelector('a.back[href="#"]'));for(const href of links){assert(GAMES.some(g=>href==='#game/'+g.id));gameLinks.push(href);}}
assert.equal(new Set(gameLinks).size,16);
for(const g of GAMES){w.history.replaceState(null,'','#'+(gameLinks.find(href=>href==='#game/'+g.id)).replace(/^#/,''));api.route();assert.equal(d.querySelector('a.back').getAttribute('href'),'#topic/'+g.topic);assert(d.querySelector('header a[href="#"]'));if(g.type==='match'){
for(let batch=0;batch<3;batch++){const left=[...d.querySelectorAll('[data-side="left"]')];for(const l of left){l.click();d.querySelector('[data-side="right"][data-key="'+l.dataset.key+'"]').click();assert.match(d.querySelector('.feedback').textContent,/Correct!/);}assert.equal(d.querySelector('#next').disabled,false);d.querySelector('#next').click();}
}else{
for(let n=0;n<g.questions.length;n++){const q=api.getState().questions[n],buttons=[...d.querySelectorAll('[data-answer]')];if(n===0){const wrong=buttons.find(b=>b.dataset.answer!==q.answer);wrong.click();assert.match(d.querySelector('.feedback').textContent,/Try again!/);assert.equal(d.querySelector('#next').disabled,true);}buttons.find(b=>b.dataset.answer===q.answer).click();assert.match(d.querySelector('.feedback').textContent,/Correct!/);assert.equal(d.querySelector('#next').disabled,false);d.querySelector('#next').click();}
}
assert(d.querySelector('.result'),g.id+' result');assert.equal(api.getState().score,g.questions.length-(g.type==='match'?0:1));const form=d.querySelector('.completion-form');assert(form,g.id+' completion form');
assert.deepEqual([...form.elements.class_section.options].map(o=>o.value),['','CM1 A','CM1 D']);
form.elements.student_name.value='   ';form.elements.class_section.value='CM1 A';form.dispatchEvent(new w.Event('submit',{cancelable:true}));assert.equal(form.elements.student_name.validationMessage,'Please enter your name.');
form.elements.student_name.value='<Reem & student>';form.elements.student_name.dispatchEvent(new w.Event('input'));form.elements.class_section.value='CM1 D';form.dispatchEvent(new w.Event('submit',{cancelable:true}));await new Promise(resolve=>setTimeout(resolve,0));
const record=submitted.at(-1);assert.equal(record.student_name,'<Reem & student>');assert.equal(record.class_section,'CM1 D');assert.equal(record.exercise,g.title);assert.equal(record.game,'CM1 · '+TOPICS.find(t=>t.id===g.topic).title);assert.equal(record.score,api.getState().score);assert.equal(record.total,g.questions.length);assert.equal(form.querySelector('button').disabled,true);
d.querySelector('#replay').click();assert.equal(api.getState().score,0);assert.equal(api.getState().index,0);
}
w.history.replaceState(null,'','#'+('game/match').replace(/^#/,''));api.route();d.querySelector('[data-side="left"][data-key="0"]').click();d.querySelector('[data-side="right"][data-key="1"]').click();assert.match(d.querySelector('.feedback').textContent,/Try again!/);d.querySelector('[data-side="left"][data-key="0"]').click();d.querySelector('[data-side="right"][data-key="0"]').click();assert.equal(api.getState().score,0);assert.equal(api.getState().pairs,1);
w.history.replaceState(null,'','#'+('game/not-a-game').replace(/^#/,''));api.route();assert.equal(d.querySelectorAll('.section').length,2);
w.localStorage.clear();w.history.replaceState(null,'','#'+('game/sentence-ending').replace(/^#/,''));api.route();const punctuationGame=api.getState().game;for(let n=0;n<punctuationGame.questions.length;n++){const q=api.getState().questions[n];d.querySelectorAll('[data-answer]').forEach(b=>{if(b.dataset.answer===q.answer)b.click();});d.querySelector('#next').click();}
const failingForm=d.querySelector('.completion-form');failingForm.elements.student_name.value='Test';failingForm.elements.class_section.value='CM1 A';let failedRecord;w.ResultsAPI.submit=async record=>{failedRecord=record;throw new Error('Network unavailable')};failingForm.dispatchEvent(new w.Event('submit',{cancelable:true}));await new Promise(resolve=>setTimeout(resolve,0));assert.match(d.querySelector('.submission-status').textContent,/could not be confirmed/);assert.equal(failingForm.querySelector('button').disabled,false);assert.equal(failingForm.elements.student_name.disabled,true);let retryRecord;w.ResultsAPI.submit=async record=>{retryRecord=record};failingForm.dispatchEvent(new w.Event('submit',{cancelable:true}));await new Promise(resolve=>setTimeout(resolve,0));assert.equal(retryRecord,failedRecord);assert.match(d.querySelector('.submission-status').textContent,/sent to your teacher/);assert.equal(w.localStorage.getItem('cm1-results'),null);
assert.equal(api.shuffle([1,2,3]).length,3);
console.log('Passed: 16 complete games; topic navigation; correct and incorrect answers; first-try scoring; matching; results; replay; invalid-route fallback.');
dom.window.close();

})().catch(error=>{console.error(error);process.exitCode=1;});
