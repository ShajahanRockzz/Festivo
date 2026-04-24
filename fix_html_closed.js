const fs = require('fs');
const file = 'Festivo_Frontend/src/app/Participant/festdetailsparticipant/festdetailsparticipant.html';
let data = fs.readFileSync(file, 'utf8');

data = data.replace(
  '<button class="btn-outline" (click)="registerNow(comp.competition_id)">Register Now</button>',
  '<button *ngIf="!isRegistrationClosed(comp.competition_date)" class="btn-outline" (click)="registerNow(comp.competition_id)">Register Now</button>\n                  <button *ngIf="isRegistrationClosed(comp.competition_date)" class="btn-outline" disabled style="opacity: 0.6; cursor: not-allowed; border-color: #ef4444; color: #ef4444; background: rgba(239, 68, 68, 0.1);">Registration Closed</button>'
);

fs.writeFileSync(file, data, 'utf8');
console.log('Fixed Form Validations');
