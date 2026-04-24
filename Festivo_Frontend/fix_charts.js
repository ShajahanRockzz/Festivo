const fs = require('fs');
let content = fs.readFileSync('src/app/app.module.ts', 'utf8');

if (!content.includes('NgChartsModule')) {
    content = "import { NgChartsModule } from 'ng2-charts';\n" + content;
    content = content.replace("imports: [", "imports: [\n    NgChartsModule,");
    fs.writeFileSync('src/app/app.module.ts', content, 'utf8');
    console.log('Added NgChartsModule to app.module.ts');
} else {
    console.log('NgChartsModule already imported.');
}
