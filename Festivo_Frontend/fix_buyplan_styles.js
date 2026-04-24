
const fs = require('fs');
let content = fs.readFileSync('src/app/Institution/buyplan/buyplan.scss', 'utf8');

// The scss file uses sass variables. It's best we redefine these variables or replace hardcoded elements.
content = content.replace(/\-blue: #0052a3;/g, '\-blue: #0ea5e9;');
content = content.replace(/\-blue: #2979f0;/g, '\-blue: #6366f1;');
content = content.replace(/\-gray: #f3f4f6;/g, '\-gray: var(--surface-slate);');
content = content.replace(/\-color: #e5e7eb;/g, '\-color: var(--border-subtle);');
content = content.replace(/\-dark: #1f2937;/g, '\-dark: var(--text-pure);');
content = content.replace(/\-light: #6b7280;/g, '\-light: var(--text-slate);');

// The Page Header gradient
content = content.replace(/background: linear-gradient\(135deg, \-blue 0%, \-blue 100\%\);/g, 'background: var(--btn-gradient);');

// Change hardcoded background in plan card
content = content.replace(/background: var\(--color-surface\);/g, 'background: var(--bg-midnight);');
content = content.replace(/background-color: #f9fafb;/g, 'background-color: var(--surface-slate); filter: brightness(1.2);');
content = content.replace(/background-color: #ffffff;/g, 'background-color: var(--surface-slate);');

fs.writeFileSync('src/app/Institution/buyplan/buyplan.scss', content);

