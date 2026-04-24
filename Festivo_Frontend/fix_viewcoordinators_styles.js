
const fs = require('fs');
let content = fs.readFileSync('src/app/Institution/viewcoordinators/viewcoordinators.scss', 'utf8');

// Container & Header
content = content.replace(/background: var\(--color-surface\);/g, 'background: var(--bg-midnight);');
content = content.replace(/background-color: var\(--color-surface\);/g, 'background-color: var(--surface-slate);');
content = content.replace(/background: linear-gradient\(135deg, #1e88e5 0%, #1565c0 100\%\);/g, 'background: var(--btn-gradient);');

// Controls
content = content.replace(/color: #2c3e50;/g, 'color: var(--text-pure);');
content = content.replace(/color: #bbb;/g, 'color: var(--text-slate);');
content = content.replace(/border: 2px solid #e0e0e0;/g, 'border: 2px solid var(--border-subtle);');

// Text vars
content = content.replace(/var\(--color-text-secondary\)/g, 'var(--text-slate)');

// Card general
content = content.replace(/background: linear-gradient\(135deg, #f0f7ff 0%, #ffffff 100\%\);/g, 'background: var(--surface-slate);');
content = content.replace(/border-top: 1px solid #f0f0f0;/g, 'border-top: 1px solid var(--border-subtle);');

// Modal styles
content = content.replace(/background: #ffffff;/g, 'background: var(--bg-midnight);');

fs.writeFileSync('src/app/Institution/viewcoordinators/viewcoordinators.scss', content);

