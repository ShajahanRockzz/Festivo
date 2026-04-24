
const fs = require('fs');
let content = fs.readFileSync('src/app/Institution/addcoordinator/addcoordinator.scss', 'utf8');

// The first .back-btn had white border and color #1e88e5. Let's fix that for dark theme.
content = content.replace(/border: 2px solid white;/g, 'border: 2px solid var(--border-subtle);');
content = content.replace(/color: #1e88e5;/g, 'color: var(--text-pure);');
content = content.replace(/background-color: rgba\(255,255,255, 0.05\);/g, 'background-color: var(--surface-slate); filter: brightness(1.2);');

// The input fields inside forms should have a visible border or base color
content = content.replace(/.form-control \{\s*width: 100%;/g, '.form-control {\n                width: 100%;\n                color: var(--text-pure);');

// Make submit buttons looks good
content = content.replace(/color: #ffffff;/g, 'color: var(--text-pure);'); 

// Ensure form card itself uses surface-slate
// checking if it exists
fs.writeFileSync('src/app/Institution/addcoordinator/addcoordinator.scss', content);

