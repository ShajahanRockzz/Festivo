const fs = require('fs');
const f = 'c:/Users/shaja/OneDrive/Desktop/Santhigiri/S6/Main Project/Project/Festivo/Festivo_Frontend/src/styles.scss';
let d = fs.readFileSync(f, 'utf8');
d = d.replace(/transform:\s*translateY\(0\);/g, 'transform: none;');
fs.writeFileSync(f, d, 'utf8');
