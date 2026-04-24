const fs = require('fs');
const file = 'Festivo_Frontend/src/app/Participant/registercompetition/registercompetition.html';
let data = fs.readFileSync(file, 'utf8');

data = data.replace(
  '[(ngModel)]="paymentDetails.cardNumber"',
  '[ngModel]="paymentDetails.cardNumber" (ngModelChange)="onCardNumberChange($event)"'
);

data = data.replace(
  '[(ngModel)]="paymentDetails.expiryDate"',
  '[ngModel]="paymentDetails.expiryDate" (ngModelChange)="onExpiryDateChange($event)"'
);

fs.writeFileSync(file, data, 'utf8');
console.log('Fixed HTML inputs');
