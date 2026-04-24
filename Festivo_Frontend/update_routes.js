const fs = require('fs');
let code = fs.readFileSync('src/app/app.routes.ts', 'utf8');
if (!code.includes('Totalrevenue')) {
    code = code.replace("import { Adminviewprofile } from './Admin/adminviewprofile/adminviewprofile';", 
    "import { Adminviewprofile } from './Admin/adminviewprofile/adminviewprofile';\nimport { Totalrevenue } from './Admin/totalrevenue/totalrevenue';");
    const adminRoutesRegex = /(path:\s*'adminhome',\s*component:\s*Adminhome,\s*children:\s*\[[\s\S]*?)(?=])/;
    code = code.replace(adminRoutesRegex, "$1  { path: 'totalrevenue', component: Totalrevenue },\n    ");
    fs.writeFileSync('src/app/app.routes.ts', code, 'utf8');
    console.log('Added totalrevenue route');
} else {
    console.log('totalrevenue already in app.routes.ts');
}
