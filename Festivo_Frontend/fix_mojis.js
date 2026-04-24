const fs = require('fs');
const iconv = require('iconv-lite');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else {
            callback(dirPath);
        }
    });
}

function hasMojibake(text) {
    // Mojibake of UTF-8 commonly starts with â (e2), Ã (c3), ð (f0)
    // For emojis, it's mostly ð (f0) followed by Ÿ (9f)
    return /ðŸ|â[€œ”]/g.test(text) || text.includes('â‚¹') || text.includes('âœ“') || text.includes('âš');
}

function fixFile(filePath) {
    if (!filePath.endsWith('.html') && !filePath.endsWith('.scss') && !filePath.endsWith('.ts')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    if (hasMojibake(content)) {
        console.log('Fixing:', filePath);
        const buf = iconv.encode(content, 'win1252');
        const fixedContent = iconv.decode(buf, 'utf8');
        fs.writeFileSync(filePath, fixedContent, 'utf8');
    }
}

walkDir('src/app', fixFile);
console.log('Done fixing mojibake');
