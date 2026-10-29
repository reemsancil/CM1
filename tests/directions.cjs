const assert=require('node:assert/strict');
const fs=require('node:fs');
const {JSDOM}=require('jsdom');
function load(released){
 const dom=new JSDOM('<main id="app"></main>',{url:'https://cm1.example/',runScripts:'outside-only'});
 const w=dom.window;w.scrollTo=()=>{};
 w.eval(['data.js','directions.js',...(released?['directions-content.js']:[]),'app.js'].map(n=>fs.readFileSync(n,'utf8')).join('\n')+'\nwindow.api={GAMES,TOPICS,route};');
 return dom;
}
const locked=load(false),w=locked.window;
assert.equal(w.document.querySelectorAll('.home-topic').length,8);
assert.equal(w.document.querySelectorAll('.locked-topic').length,1);
for(const hash of ['topic/directions','game/directions-signs','game/directions-words','game/directions-route']){
 w.history.replaceState(null,'','#'+hash);w.api.route();
 assert.match(w.document.querySelector('#app').textContent,/Available after the lesson/);
 assert.equal(w.document.querySelectorAll('[data-answer]').length,0);
}
assert.equal(w.api.GAMES.filter(g=>g.topic==='directions').length,0);
locked.window.close();
const open=load(true),v=open.window;
const games=v.api.GAMES.filter(g=>g.topic==='directions');
assert.equal(games.length,3);assert.equal(games.reduce((n,g)=>n+g.questions.length,0),30);
for(const g of games){
 for(const q of g.questions){assert(q.choices.includes(q.answer));assert.equal(new Set(q.choices).size,q.choices.length);}
 v.history.replaceState(null,'','#game/'+g.id);v.api.route();
 assert.equal(v.document.querySelectorAll('[data-answer]').length,3);
 assert(!v.document.querySelector('#app').textContent.includes('Available after the lesson'));
}
assert.equal(v.document.querySelector('svg').getAttribute('viewBox'),'0 0 560 340');
open.window.close();
if(!JSON.parse(fs.readFileSync('directions-settings.json')).released){
 assert(!fs.existsSync('dist/directions-content.js'));
 assert(!fs.readFileSync('dist/index.html','utf8').includes('src="directions-content.js"'));
}
console.log('Passed: directions locking, direct URLs, excluded deployed content, released games and 30 questions.');
