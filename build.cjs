const fs = require('node:fs');
fs.mkdirSync('dist', { recursive: true });
for (const name of ['index.html', 'styles.css', 'data.js', 'app.js', 'results-api.js', 'teacher.html', 'teacher.js', 'results.css']) {
  fs.copyFileSync(name, 'dist/' + name);
}
console.log('Static site prepared in dist/.');
