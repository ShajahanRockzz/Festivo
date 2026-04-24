const fs = require('fs');
const file = 'Festivo_Frontend/src/app/Participant/registercompetition/registercompetition.html';
let data = fs.readFileSync(file, 'utf8');

// 1. Email validation
data = data.replace(
  '<input type="email" [(ngModel)]="member.email" name="memberEmail_{{i}}" [required]="!showPayment">',
  '<input type="email" [(ngModel)]="member.email" name="memberEmail_{{i}}" [required]="!showPayment" email #mEmail="ngModel">\n                        <small *ngIf="mEmail.invalid && mEmail.touched" style="color:#ef4444; font-size:12px; margin-top:5px; display:block;">Valid email required</small>'
);

// 2. CVV strictly 3 numbers limit
data = data.replace(
  '<input type="password" [(ngModel)]="paymentDetails.cvv" name="cvv" [required]="showPayment" pattern="^\\d{3,4}$" placeholder="XXX" maxlength="4" #cvv="ngModel">',
  '<input type="password" [ngModel]="paymentDetails.cvv" (ngModelChange)="onCvvChange(\\)" name="cvv" [required]="showPayment" pattern="^\\d{3}$" placeholder="XXX" maxlength="3" #cvv="ngModel">'
);

// 3. Update CVV error text slightly just in case
data = data.replace(
  '<small *ngIf="cvv.invalid && cvv.touched" style="color:#ef4444; font-size:12px; margin-top:5px; display:block;">Valid CVV required</small>',
  '<small *ngIf="cvv.invalid && cvv.touched" style="color:#ef4444; font-size:12px; margin-top:5px; display:block;">Valid 3-digit CVV required</small>'
);

// 4. Expiry invalid error text
data = data.replace(
  '<small *ngIf="exp.invalid && exp.touched" style="color:#ef4444; font-size:12px; margin-top:5px; display:block;">Format MM/YY required</small>',
  '<small *ngIf="exp.invalid && exp.touched" style="color:#ef4444; font-size:12px; margin-top:5px; display:block;">Format MM/YY required</small>\n              <small *ngIf="isExpiryInvalid && exp.valid" style="color:#ef4444; font-size:12px; margin-top:5px; display:block;">Card has expired</small>'
);

// 5. Submit button disabling condition updated with isExpiryInvalid
data = data.replace(
  '<button type="submit" class="btn-submit" [disabled]="!registrationForm.form.valid || isSubmitting">',
  '<button type="submit" class="btn-submit" [disabled]="!registrationForm.form.valid || isSubmitting || isExpiryInvalid">'
);

fs.writeFileSync(file, data, 'utf8');
console.log('Fixed Form Validations');
