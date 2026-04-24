const fs = require('fs');

let f = fs.readFileSync('Festivo_Frontend/src/app/Guest/registerinstitution/registerinstitution.html', 'utf8');
f = f.replace(
  '<form (ngSubmit)="submitRegistration()" #registrationForm="ngForm">',
  '<form (ngSubmit)="submitRegistration()" #registrationForm="ngForm">\n' +
  '  <!-- Global Messages -->\n' +
  '  <div *ngIf="errorMessage" class="alert alert-error" style="margin-bottom: 20px; padding: 15px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 12px; color: #ef4444; font-weight: 500; text-align: center;">\n' +
  '    {{ errorMessage }}\n' +
  '  </div>\n' +
  '  <div *ngIf="successMessage" class="alert alert-success" style="margin-bottom: 20px; padding: 15px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; color: #10b981; font-weight: 500; text-align: center;">\n' +
  '    {{ successMessage }}\n' +
  '  </div>'
);
fs.writeFileSync('Festivo_Frontend/src/app/Guest/registerinstitution/registerinstitution.html', f);

let f2 = fs.readFileSync('Festivo_Frontend/src/app/Guest/registerparticipant/registerparticipant.html', 'utf8');
f2 = f2.replace(
  '<form (ngSubmit)="submitRegistration()" #registrationForm="ngForm">',
  '<form (ngSubmit)="submitRegistration()" #registrationForm="ngForm">\n' +
  '  <!-- Global Messages -->\n' +
  '  <div *ngIf="errorMessage" class="alert alert-error" style="margin-bottom: 20px; padding: 15px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 12px; color: #ef4444; font-weight: 500; text-align: center;">\n' +
  '    {{ errorMessage }}\n' +
  '  </div>\n' +
  '  <div *ngIf="successMessage" class="alert alert-success" style="margin-bottom: 20px; padding: 15px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; color: #10b981; font-weight: 500; text-align: center;">\n' +
  '    {{ successMessage }}\n' +
  '  </div>'
);
fs.writeFileSync('Festivo_Frontend/src/app/Guest/registerparticipant/registerparticipant.html', f2);

let t1 = fs.readFileSync('Festivo_Frontend/src/app/Guest/registerinstitution/registerinstitution.ts', 'utf8');
t1 = t1.replace(
  'if (!this.validateForm()) {\n      return;\n    }',
  'if (!this.validateForm()) {\n      window.scrollTo({ top: 0, behavior: \'smooth\' });\n      return;\n    }'
);
fs.writeFileSync('Festivo_Frontend/src/app/Guest/registerinstitution/registerinstitution.ts', t1);

let t2 = fs.readFileSync('Festivo_Frontend/src/app/Guest/registerparticipant/registerparticipant.ts', 'utf8');
t2 = t2.replace(
  'if (!this.validateForm()) {\n      return;\n    }',
  'if (!this.validateForm()) {\n      window.scrollTo({ top: 0, behavior: \'smooth\' });\n      return;\n    }'
);
fs.writeFileSync('Festivo_Frontend/src/app/Guest/registerparticipant/registerparticipant.ts', t2);

console.log('Fixed');
