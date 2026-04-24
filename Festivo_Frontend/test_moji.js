const fs = require('fs');
const iconv = require('iconv-lite');

function fixMojibake(text) {
    try {
        // Convert to Windows-1252 bytes
        const buf = iconv.encode(text, 'win1252');
        // Decode those bytes as UTF-8
        return iconv.decode(buf, 'utf8');
    } catch (e) {
        return text;
    }
}

const str = 'ðŸ‘‹ ðŸ“Œ';
console.log(fixMojibake(str));
