process.on('unhandledRejection', (reason, p) => {
  console.log('--- PROMISE REJECTION ---');
  console.log(reason);
});
const { JSDOM } = require('jsdom');
const fs = require('fs');

const idxHtml = fs.readFileSync('dist/Festivo_Frontend/browser/index.html', 'utf8');
const mainJs = fs.readFileSync('dist/Festivo_Frontend/browser/main.js', 'utf8');

const tHtml = idxHtml.replace('<script src="main.js" type="module"></script>', '<script>' + mainJs + '</script>');

const dom = new JSDOM(tHtml, { 
  runScripts: 'dangerously',
  url: 'http://localhost/'
});

dom.window.addEventListener('error', (event) => {
  console.log('--- ERROR IN DOM ---');
  console.log(event.error ? event.error : event.message);
});
setTimeout(() => {
  console.log('App root content:', dom.window.document.querySelector('app-root').innerHTML);
}, 2000);
