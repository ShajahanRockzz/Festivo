const fs = require('fs');
const path = 'C:/Users/shaja/OneDrive/Desktop/Santhigiri/S6/Main Project/Project/Festivo/Festivo_Frontend/src/app/app.routes.ts';
let code = fs.readFileSync(path, 'utf8');

if(!code.includes('import { Mycompetitions }')) {
  code = "import { Mycompetitions } from './Participant/mycompetitions/mycompetitions';\n" + code;
}

if(!code.includes('path: \'mycompetitions\'')) {
  code = code.replace(
      "{path: 'registrationdetails/:id', component: Registrationdetails}",
      "{path: 'registrationdetails/:id', component: Registrationdetails},\n            {path: 'mycompetitions', component: Mycompetitions}"
  );
}

fs.writeFileSync(path, code);
console.log('Mycompetitions route added!');
