const fs = require('fs');
let c = fs.readFileSync('src/app/Admin/editcategory/editcategory.scss', 'utf8');

// Strip all unwanted zero-width characters or garbage at the very start
while (c.length > 0 && (c.charCodeAt(0) < 32 || c.charCodeAt(0) > 126 || c[0] === '?' || c[0] === '.' || c[0] === '0')) {
    if (c.startsWith('.edit-category-container')) {
        break; // Stop if we hit the actual class name
    }
    c = c.slice(1);
}

// Ensure the first class is correct
if (!c.startsWith('.edit-category-container')) {
  c = '.edit-category-container' + c;
}

fs.writeFileSync('src/app/Admin/editcategory/editcategory.scss', c);
console.log('Cleaned editcategory.scss');

// Let's also fix the HTML class to match `.edit-category-container`
let html = fs.readFileSync('src/app/Admin/editcategory/editcategory.html', 'utf8');
html = html.replace(/<div class="add-category-container/g, '<div class="edit-category-container');
fs.writeFileSync('src/app/Admin/editcategory/editcategory.html', html);
console.log('Fixed HTML class name');