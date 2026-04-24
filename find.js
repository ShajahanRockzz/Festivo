const fs = require('fs');
const d = fs.readFileSync('c:/Users/shaja/OneDrive/Desktop/Santhigiri/S6/Main Project/Project/Festivo/Festivo_Frontend/src/app/Guest/login/login.html', 'utf8');

const matches = [
  /<span class=\"back-arrow\">([^<]+)<\/span>/,
  /<span class=\"alert-icon\">([^<]+)<\/span>/g,
  /{{ showPassword \? '([^']+)' : '([^']+)' }}/,
  /<span class=\"badge badge-admin\">([^ ]+) Admin/,
  /<span class=\"badge badge-institution\">([^ ]+) Institution/,
  /<span class=\"badge badge-participant\">([^ ]+) Participant/,
  /<span class=\"badge badge-coordinator\">([^ ]+) Coordinator/
];

for (const m of matches) {
  const result = d.match(m);
  if (result) console.log(result.slice(1));
}
