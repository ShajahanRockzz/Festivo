
const fs = require('fs');
let content = fs.readFileSync('src/app/Institution/viewcoordinators/viewcoordinators.scss', 'utf8');

// Action buttons background/text colors
content = content.replace(/background: #e3f2fd;/g, 'background: rgba(14, 165, 233, 0.1); border: 1px solid rgba(14, 165, 233, 0.3);');
content = content.replace(/background: #fff3e0;/g, 'background: rgba(255, 152, 0, 0.1); border: 1px solid rgba(255, 152, 0, 0.3);');
content = content.replace(/background: #ffebee;/g, 'background: rgba(244, 67, 54, 0.1); border: 1px solid rgba(244, 67, 54, 0.3);');
content = content.replace(/background: #1e88e5;/g, 'background: #0ea5e9;');

// Replace pure white with pure text variable
content = content.replace(/color: white;/g, 'color: var(--text-pure);');
content = content.replace(/color: #f44336;/g, 'color: #ff6b6b;');

fs.writeFileSync('src/app/Institution/viewcoordinators/viewcoordinators.scss', content);

