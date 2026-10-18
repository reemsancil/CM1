const fs = require('node:fs');
fs.mkdirSync('dist', { recursive: true });
for (const name of ['student-roster.js', 'index.html', 'styles.css', 'data.js', 'app.js', 'results-api.js', 'teacher.html', 'teacher.js', 'results.css', 'gift-config.js', 'unit-progress.js', 'teacher-gifts.js', 'gifts.js', 'gifts.css']) {
  fs.copyFileSync(name, 'dist/' + name);
}
console.log('Static site prepared in dist/.');

