
const fs = require('fs');
let content = fs.readFileSync('src/app/Institution/addcoordinator/addcoordinator.scss', 'utf8');

// Replace standard variables
content = content.replace(/var\(--color-surface\)/g, 'var(--surface-slate)');
content = content.replace(/var\(--color-text-secondary\)/g, 'var(--text-slate)');

// Fix image section
content = content.replace(/background: linear-gradient\(135deg, #f0f7ff 0%, #ffffff 100\%\);/g, 'background: var(--surface-slate);');
content = content.replace(/background-color: #f8fbff;/g, 'background-color: var(--bg-midnight);');
content = content.replace(/background-color: #f0f5ff;/g, 'background-color: rgba(255,255,255, 0.05);');
content = content.replace(/border: 2px dashed #1e88e5;/g, 'border: 2px dashed var(--text-slate);');
content = content.replace(/.image-upload-area {[\s\S]*?&:hover {[\s\S]*?border-color: #1565c0;/g, match => match.replace('#1565c0', '#0ea5e9'));

// Form section titles and text
content = content.replace(/color: #2c3e50;/g, 'color: var(--text-pure);');
content = content.replace(/border-bottom: 1px solid #f5f5f5;/g, 'border-bottom: 1px solid var(--border-subtle);');

// Inputs
content = content.replace(/background-color: #f8fafb;/g, 'background-color: var(--bg-midnight);');
content = content.replace(/border: 2px solid transparent;/g, 'border: 2px solid var(--border-subtle);');
content = content.replace(/color: #bbb;/g, 'color: var(--text-slate);');

// Action footer
content = content.replace(/background: linear-gradient\(135deg, #f8fafb, #ffffff\);/g, 'background: var(--surface-slate); border-top: 1px solid var(--border-subtle);');
content = content.replace(/background-color: #f0f7ff;/g, 'background-color: rgba(255,255,255,0.05);');

// Header gradient
content = content.replace(/background: linear-gradient\(135deg, #1e88e5 0%, #1565c0 100\%\);/g, 'background: var(--btn-gradient);');

fs.writeFileSync('src/app/Institution/addcoordinator/addcoordinator.scss', content);

