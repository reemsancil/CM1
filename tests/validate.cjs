const assert=require('node:assert/strict');
const fs=require('node:fs');
const {LANDMARKS,TOPICS,GAMES}=require('../data.js');
assert.equal(TOPICS.length,6);assert.equal(GAMES.length,14);assert.equal(LANDMARKS.length,12);
for(const g of GAMES){assert(g.questions.length>=8,g.id);for(const q of g.questions){assert(q.prompt&&q.answer);if(g.type!=='match')assert(q.choices.includes(q.answer),g.id+': '+q.prompt);assert.equal(new Set(q.choices).size,q.choices.length);}}
const {JSDOM}=require('jsdom');
const dom=new JSDOM(fs.readFileSync('index.html','utf8'),{url:'https://cm1.example/',runScripts:'outside-only'});
const w=dom.window;w.scrollTo=()=>{};w.eval(fs.readFileSync('data.js','utf8')+'\n'+fs.readFileSync('app.js','utf8')+'\nwindow.testAPI={GAMES,TOPICS,getState:()=>state,route,shuffle};');
const d=w.document,api=w.testAPI;
assert.equal(d.querySelectorAll('.topic').length,6);
assert.equal(d.querySelectorAll('.section').length,2);
assert.equal(d.querySelector('.home-heading h1').textContent,'CM1 English Games');
assert.equal(d.querySelector('.home-heading p').textContent,'Practice your English and have fun!');
assert.deepEqual([...d.querySelectorAll('.section-head h2')].map(x=>x.textContent),['VOCABULARY','GRAMMAR']);
assert.deepEqual([...d.querySelectorAll('.home-topic h3')].map(x=>x.textContent),['London Landmarks','Family Tree','Prepositions of Place','Subject Pronouns','Object Pronouns','Verb to Be']);
assert.equal(d.querySelectorAll('.homepage a[href^="#game/"]').length,0);
assert.equal(d.querySelectorAll('.london-banner svg[role="img"]').length,1);
assert.equal(d.querySelector('.london-banner').textContent,'');
assert.equal(d.querySelectorAll('.home-topic .home-icon svg').length,6);
assert(d.body.classList.contains('home-view'));

const topicLinks=[...d.querySelectorAll('.home-topic')].map(a=>a.getAttribute('href'));
const gameLinks=[];
for(const link of topicLinks){w.location.hash=link;api.route();const t=TOPICS.find(t=>link==='#topic/'+t.id);assert(t);assert(!d.body.classList.contains('home-view'));const links=[...d.querySelectorAll('.game-list .topic')].map(a=>a.getAttribute('href'));assert.equal(links.length,GAMES.filter(g=>g.topic===t.id).length);assert(d.querySelector('header a[href="#"]'));assert(d.querySelector('a.back[href="#"]'));for(const href of links){assert(GAMES.some(g=>href==='#game/'+g.id));gameLinks.push(href);}}
assert.equal(new Set(gameLinks).size,14);
for(const g of GAMES){w.location.hash=gameLinks.find(href=>href==='#game/'+g.id);api.route();assert.equal(d.querySelector('a.back').getAttribute('href'),'#topic/'+g.topic);assert(d.querySelector('header a[href="#"]'));if(g.type==='match'){
for(let batch=0;batch<3;batch++){const left=[...d.querySelectorAll('[data-side="left"]')];for(const l of left){l.click();d.querySelector('[data-side="right"][data-key="'+l.dataset.key+'"]').click();assert.match(d.querySelector('.feedback').textContent,/Correct!/);}assert.equal(d.querySelector('#next').disabled,false);d.querySelector('#next').click();}
}else{
for(let n=0;n<g.questions.length;n++){const q=api.getState().questions[n],buttons=[...d.querySelectorAll('[data-answer]')];if(n===0){const wrong=buttons.find(b=>b.dataset.answer!==q.answer);wrong.click();assert.match(d.querySelector('.feedback').textContent,/Try again!/);assert.equal(d.querySelector('#next').disabled,true);}buttons.find(b=>b.dataset.answer===q.answer).click();assert.match(d.querySelector('.feedback').textContent,/Correct!/);assert.equal(d.querySelector('#next').disabled,false);d.querySelector('#next').click();}
}
assert(d.querySelector('.result'),g.id+' result');assert.equal(api.getState().score,g.questions.length-(g.type==='match'?0:1));d.querySelector('#replay').click();assert.equal(api.getState().score,0);assert.equal(api.getState().index,0);
}
w.location.hash='game/match';api.route();d.querySelector('[data-side="left"][data-key="0"]').click();d.querySelector('[data-side="right"][data-key="1"]').click();assert.match(d.querySelector('.feedback').textContent,/Try again!/);d.querySelector('[data-side="left"][data-key="0"]').click();d.querySelector('[data-side="right"][data-key="0"]').click();assert.equal(api.getState().score,0);assert.equal(api.getState().pairs,1);
w.location.hash='game/not-a-game';api.route();assert.equal(d.querySelectorAll('.section').length,2);
assert.equal(api.shuffle([1,2,3]).length,3);
console.log('Passed: 14 complete games; topic navigation; correct and incorrect answers; first-try scoring; matching; results; replay; invalid-route fallback.');
dom.window.close();
