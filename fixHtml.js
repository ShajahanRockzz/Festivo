const fs = require('fs');
const htmlPath = 'c:/Users/shaja/OneDrive/Desktop/Santhigiri/S6/Main Project/Project/Festivo/Festivo_Frontend/src/app/Guest/guestmaster/guestmaster.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const replacements = {
  'ðŸŽ‰': '🎉',
  'ðŸ‘¤': '👤',
  'ðŸ›\xef¸\x8F': '🏛️',
  'ðŸ›ï¸': '🏛️'
};

for (const [bad, good] of Object.entries(replacements)) {
  html = html.split(bad).join(good);
}

fs.writeFileSync(htmlPath, html, 'utf8');
