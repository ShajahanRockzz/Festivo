
const fs = require('fs');
let content = fs.readFileSync('src/app/Institution/viewcoordinators/viewcoordinators.scss', 'utf8');

// Fix buttons and background overlaps
content = content.replace(/background-color: #f8fafb;/g, 'background-color: var(--surface-slate); filter: brightness(1.2);');
content = content.replace(/background-color: #f0f7ff;/g, 'background-color: rgba(255,255,255, 0.05);');

// secondary btn
content = content.replace(/background: #e0e0e0;/g, 'background: var(--surface-slate); filter: brightness(1.5);');

// back button
content = content.replace(/border: 2px solid white;/g, 'border: 2px solid var(--border-subtle);');
content = content.replace(/color: #1e88e5;/g, 'color: var(--text-pure);');

// secondary text colors/colors
content = content.replace(/var\(--color-border\)/g, 'var(--border-subtle)');

fs.writeFileSync('src/app/Institution/viewcoordinators/viewcoordinators.scss', content);

