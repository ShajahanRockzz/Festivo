const fs = require('fs');
let code = fs.readFileSync('src/app/app.routes.ts', 'utf8');

if (!code.includes("import { Totalrevenue }")) {
    code = "import { Totalrevenue } from './Admin/totalrevenue/totalrevenue';\n" + code;
    fs.writeFileSync('src/app/app.routes.ts', code, 'utf8');
    console.log('Import added successfully.');
} else {
    console.log('Import already exists.');
}
