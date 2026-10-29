const fs = require('node:fs');
fs.rmSync('dist', {recursive:true,force:true});
fs.mkdirSync('dist', { recursive: true });
for (const name of ['teacher-preview.js', 'directions.js', 'student-roster.js', 'index.html', 'styles.css', 'data.js', 'app.js', 'results-api.js', 'teacher.html', 'teacher.js', 'results.css', 'gift-config.js', 'unit-progress.js', 'teacher-gifts.js', 'gifts.js', 'gifts.css']) {
  fs.copyFileSync(name, 'dist/' + name);
}
console.log('Static site prepared in dist/.');


const released = JSON.parse(fs.readFileSync('directions-settings.json','utf8')).released === true;
if(released) fs.copyFileSync('directions-content.js','dist/directions-content.js');
const html=fs.readFileSync('dist/index.html','utf8').replace('<!-- DIRECTIONS_CONTENT -->',released?'<script defer src="directions-content.js"></script>':'');
fs.writeFileSync('dist/index.html',html);
console.log('Directions games: '+(released?'released':'locked (questions excluded)'));

// Keep teacher-only questions outside the static publish directory.
fs.mkdirSync('netlify/private',{recursive:true});
fs.writeFileSync('netlify/private/directions.cjs','module.exports = '+JSON.stringify(fs.readFileSync('directions-content.js','utf8'))+';\n');
