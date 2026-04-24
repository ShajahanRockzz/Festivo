const fs = require('fs');
let ts = fs.readFileSync('src/app/Guest/login/login.ts', 'utf8');

if (!ts.includes('isSuccess = false;')) {
  ts = ts.replace('isLoading = false;', 'isLoading = false;\n  isSuccess = false;');
}

ts = ts.replace('this.isLoading = false;\n\n          if (response.success)', `this.isLoading = false;\n\n          if (response.success) {\n            this.isSuccess = true;\n            this.cdr.detectChanges();\n            setTimeout(() => {\n`);

ts = ts.replace(/this\.cdr\.detectChanges\(\);\n            }\n          \} else \{/g, `this.cdr.detectChanges();\n            }\n            }, 800);\n          } else {`);

fs.writeFileSync('src/app/Guest/login/login.ts', ts);
console.log("TS file updated for smooth delay and isSuccess variable.")
