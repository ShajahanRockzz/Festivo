const fs = require('fs');
let code = fs.readFileSync('src/app/app.routes.ts', 'utf8');

if (!code.includes("import { Competitionsdetails }")) {
  code = code.replace(
    "import { Prizereport } from './Institution/prizereport/prizereport';",
    "import { Prizereport } from './Institution/prizereport/prizereport';\nimport { Competitionsdetails } from './Institution/competitionsdetails/competitionsdetails';"
  );
}

if (!code.includes("{path: 'competitionsdetails/:id'")) {
  code = code.replace(
    "{path: 'prizereport', component: Prizereport}",
    "{path: 'prizereport', component: Prizereport},\n             {path: 'competitionsdetails/:id', component: Competitionsdetails}"
  );
}

fs.writeFileSync('src/app/app.routes.ts', code);
