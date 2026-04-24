const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

function processHtml(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Apply main container fade up
    if (/<div[^>]*class="[^"]*container[^"]*"[^>]*>/.test(content) && !/fade-in-up/.test(content)) {
        content = content.replace(/(class="[^"]*container[^"]*)"/g, '$1 fade-in-up"');
        modified = true;
    }

    // Convert secondary wrappers to grid wrapper
    if (/class="[^"]*(?:wrapper|list)[^"]*"/.test(content) && !/grid-wrapper/.test(content)) {
        content = content.replace(/(class="[^"]*(?!grid-wrapper)(?:wrapper|list)[^"]*)"/g, '$1 grid-wrapper"');
        modified = true;
    }

    // Convert cards to bento-card
    if (/class="[^"]*card[^"]*"/.test(content) && !/bento-card/.test(content)) {
        content = content.replace(/(class="[^"]*card[^"]*)"/g, '$1 bento-card"');
        modified = true;
    }

    // Convert buttons to neon-btn
    if (/class="[^"]*btn[^"]*"/.test(content) && !/neon-btn/.test(content)) {
        content = content.replace(/(class="[^"]*btn(?:-primary|-submit)?[^"]*)"/g, '$1 neon-btn"');
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated HTML:', filePath);
    }
}

function processScss(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // We can clear out heavy specific shadow/bg rules if they conflict with bento-card
    // But since CSS applies class priority, simply adding the bento-card class to HTML might be enough.
    // Let's just fix structural variables inside the SCSS to point to roots if any.
    if (content.match(/#1a[a-z0-9]+/g) || content.match(/background-color: #fff/g)) {
        content = content.replace(/background-color:\s*#ffffff;/gi, 'background-color: var(--surface-slate);');
        content = content.replace(/color:\s*#333333;/gi, 'color: var(--text-pure);');
        content = content.replace(/box-shadow:\s*[^;]+;/gi, '/* box-shadow handled globally */');
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated SCSS:', filePath);
    }
}

walkDir('src/app', (filePath) => {
    if (filePath.endsWith('.html')) processHtml(filePath);
    if (filePath.endsWith('.scss')) processScss(filePath);
});
console.log('Refactoring complete.');
