const fs = require('fs');
let code = fs.readFileSync('src/app/app.routes.ts', 'utf8');

const targetStr = "{path: 'viewallusers', component: Viewallusers}";
if (code.includes(targetStr)) {
    code = code.replace(targetStr, targetStr + ",\n            {path: 'totalrevenue', component: Totalrevenue}");
    fs.writeFileSync('src/app/app.routes.ts', code, 'utf8');
    console.log('Added totalrevenue route properly');
} else {
    console.log('Target string not found');
}
