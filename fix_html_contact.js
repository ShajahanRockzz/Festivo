const fs = require('fs');
const file = 'Festivo_Frontend/src/app/Participant/registercompetition/registercompetition.html';
let data = fs.readFileSync(file, 'utf8');

data = data.replace(
  '<input type="text" [(ngModel)]="member.contact" name="memberContact_{{i}}" [required]="!showPayment">',
  '<input type="text" [ngModel]="member.contact" (ngModelChange)="onContactChange(\\, i)" name="memberContact_{{i}}" [required]="!showPayment" pattern="^[0-9]{10}$" maxlength="10" placeholder="10-digit number" #mContact="ngModel">\n                        <small *ngIf="mContact.invalid && mContact.touched" style="color:#ef4444; font-size:12px; margin-top:5px; display:block;">Valid 10-digit number required</small>'
);

fs.writeFileSync(file, data, 'utf8');
console.log('Fixed HTML contact');
