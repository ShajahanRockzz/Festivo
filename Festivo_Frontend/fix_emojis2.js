const fs = require('fs');

let addFile = 'src/app/Admin/addcategory/addcategory.html';
let addC = fs.readFileSync(addFile, 'utf8');
// remove first char if it's not a tag
addC = addC.replace(/^[^<]+/, '');
// replace specifically broken icon
addC = addC.replace(/<div class="modal-icon">[^<]*<\/div>/, '<div class="modal-icon">✖</div>');
fs.writeFileSync(addFile, addC, 'utf8');


let homeFile = 'src/app/Admin/adminhome/adminhome.html';
let homeC = fs.readFileSync(homeFile, 'utf8');
homeC = homeC.replace(/^[^<]+/, '');

// total institutions card icon
homeC = homeC.replace(/<div class="stat-card institutions" bento-card>\s*<div class="card-header">\s*<h3>Total Institutions<\/h3>\s*<div class="icon">[^<]*<\/div>/, '<div class="stat-card institutions" bento-card>\n      <div class="card-header">\n        <h3>Total Institutions</h3>\n        <div class="icon">🏫</div>');

// total competitions card icon
homeC = homeC.replace(/<div class="stat-card competitions" bento-card>\s*<div class="card-header">\s*<h3>Total Competitions<\/h3>\s*<div class="icon">[^<]*<\/div>/, '<div class="stat-card competitions" bento-card>\n      <div class="card-header">\n        <h3>Total Competitions</h3>\n        <div class="icon">🏆</div>');

// buttons
homeC = homeC.replace(/<button class="action-btn institutions-btn" neon-btn>\s*<span class="btn-icon">[^<]*<\/span>/, '<button class="action-btn institutions-btn" neon-btn>\n        <span class="btn-icon">🏫</span>');

homeC = homeC.replace(/<button class="action-btn competitions-btn" neon-btn>\s*<span class="btn-icon">[^<]*<\/span>/, '<button class="action-btn competitions-btn" neon-btn>\n        <span class="btn-icon">🏆</span>');

fs.writeFileSync(homeFile, homeC, 'utf8');
console.log('Fixed broken characters');
