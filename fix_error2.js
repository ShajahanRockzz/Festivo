const fs = require('fs');
const paths = ['Festivo_Frontend/src/app/Guest/registerinstitution/registerinstitution.ts', 'Festivo_Frontend/src/app/Guest/registerparticipant/registerparticipant.ts'];
paths.forEach(p => {
  let ts = fs.readFileSync(p, 'utf8');
  ts = ts.replace(/this\.submitting = false;\s*this\.submitError = error\?\.error\?\.message \|\| 'An error occurred/g, "this.submitting = false;\n              this.submitError = typeof response !== 'undefined' && response.message ? response.message : 'An error occurred");
  fs.writeFileSync(p, ts);
});
console.log('Fixed error syntax 2');
