const fs = require('fs');
const path = require('path');

const usersJsPath = path.join(__dirname, 'routes', 'users.js');
let oldCode = fs.readFileSync(usersJsPath, 'utf8');

const regex = /\/\/ Get a specific institution by ID\r?\nrouter\.get\('\/:institutionId'[\s\S]*?^}\);\r?\n/m;
const match = oldCode.match(regex);

if (match) {
  let newCode = oldCode.replace(regex, '');
  newCode = newCode.replace('module.exports = router;', match[0] + '\nmodule.exports = router;');
  fs.writeFileSync(usersJsPath, newCode, 'utf8');
  console.log('Successfully moved /:institutionId route to bottom');
} else {
  console.log('Could not find matching route.');
}
