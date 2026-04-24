const fs = require('fs');
const f = 'c:/Users/shaja/OneDrive/Desktop/Santhigiri/S6/Main Project/Project/Festivo/Festivo_Frontend/src/app/Guest/login/login.html';
let d = fs.readFileSync(f, 'utf8');

d = d.replace(/dashboar\r?\nd:<\/p>\s+<div class="role-badges">/g, 'dashboard:</p>\n      <div class="role-badges">');
fs.writeFileSync(f, d, 'utf8');
