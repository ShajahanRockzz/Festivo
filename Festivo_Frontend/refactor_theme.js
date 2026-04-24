const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src/app', function(filePath) {
  if (filePath.endsWith('.scss')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Dark mode colors surface
    content = content.replace(/background(-color)?:\s*(#ffffff|#fff|white|#f8f9fa|#f4f7f6|#f9f9f9);\s*/gi, 'background$1: var(--color-surface);\n');
    content = content.replace(/color:\s*(#333|#000|black|#222|#111|#444);\s*/gi, 'color: var(--color-text-primary);\n');
    content = content.replace(/color:\s*(#666|#777|#555|#888|#999);\s*/gi, 'color: var(--color-text-secondary);\n');
    
    // Remove old shadows, add thin borders
    content = content.replace(/box-shadow:[^;]+;/gi, '/* shadow removed */');
    content = content.replace(/border(-bottom|-top|-left|-right)?:\s*1px\s+solid\s+(#ddd|#eee|#ccc|#e0e0e0|#dee2e6|#ced4da)[^;]*;/gi, 'border$1: 1px solid var(--color-border);');
    
    // Borders
    content = content.replace(/border-radius:\s*[0-9]+px/gi, 'border-radius: 20px');

    // Button backgrounds
    content = content.replace(/background(-color)?:\s*(#007bff|#0d6efd|#3f51b5|#1976d2|blue)[^;]*;/gi, 'background: var(--gradient-btn);');

    // Cards
    content = content.replace(/\.card\s*{/g, '.card {\n  background-color: var(--color-surface);\n  border: 1px solid var(--color-border);\n');

    // Navbars
    content = content.replace(/\.navbar\s*{/g, '.navbar {\n  background: rgba(15, 23, 42, 0.7);\n  backdrop-filter: blur(12px);\n  border-bottom: 1px solid var(--color-border);\n');

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Updated: ' + filePath);
    }
  }
});
console.log('Done refactoring SCSS!');
