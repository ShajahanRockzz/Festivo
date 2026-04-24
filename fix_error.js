const fs = require('fs');
const paths = ['Festivo_Frontend/src/app/Guest/registerinstitution/registerinstitution.ts', 'Festivo_Frontend/src/app/Guest/registerparticipant/registerparticipant.ts'];
paths.forEach(p => {
  let ts = fs.readFileSync(p, 'utf8');
  ts = ts.replace(/this\.submitError =  \|\| ; window\.scrollTo\(\{ top: 0, behavior: 'smooth' \}\);/g, "this.submitError = error?.error?.message || 'An error occurred during registration. Please try again later.'; window.scrollTo({ top: 0, behavior: 'smooth' });");
  fs.writeFileSync(p, ts);
});
console.log('Fixed error syntax');
