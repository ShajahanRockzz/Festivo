const fs = require('fs');
const paths = ['Festivo_Frontend/src/app/Guest/registerinstitution/registerinstitution.ts', 'Festivo_Frontend/src/app/Guest/registerparticipant/registerparticipant.ts'];
paths.forEach(p => {
  let ts = fs.readFileSync(p, 'utf8');
  ts = ts.replace(/if\s*\(response\.success\)\s*\{\s*this\.submitError\s*=\s*'';\s*this\.submitSuccess\s*=\s*'';/, "if(response.success){ this.submitError=''; this.submitSuccess='Registration successful!'; window.scrollTo({ top: 0, behavior: 'smooth' }); ");
  ts = ts.replace(/this\.submitError \= (error\.[a-zA-Z]+ \|\| 'An error occurred\.');/, "this.submitError = ; window.scrollTo({ top: 0, behavior: 'smooth' });");
  fs.writeFileSync(p, ts);
});
console.log('Fixed success message');
