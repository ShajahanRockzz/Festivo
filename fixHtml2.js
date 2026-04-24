const fs = require('fs');
const htmlPath = 'c:/Users/shaja/OneDrive/Desktop/Santhigiri/S6/Main Project/Project/Festivo/Festivo_Frontend/src/app/Guest/guestmaster/guestmaster.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const replacements = [
  { match: /ðŸŽ‰/g, replace: '🎉' },
  { match: /ðŸ‘¤/g, replace: '👤' },
  { match: /ðŸ›ï¸/g, replace: '🏛️' },
  { match: /ðŸ›\xef¸\x8F/g, replace: '🏛️' }
];

for (const {match, replace} of replacements) {
  html = html.replace(match, replace);
}

fs.writeFileSync(htmlPath, html, 'utf8');
