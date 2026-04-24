const fs = require('fs');
const file = 'Festivo_Frontend/src/app/Participant/registercompetition/registercompetition.html';
let data = fs.readFileSync(file, 'utf8');

data = data.replace(
  '<div class="form-group">\n                   <label>College ID Proof (Image) *</label>\n                   <input type="file" (change)="onFileChange($event, i)" name="memberIdProof_{{i}}" accept="image/*" [required]="!showPayment && !member.idProofFile">\n                </div>',
  <div class="form-group file-upload-group">
                   <label>College ID Proof (Image) *</label>
                   
                   <div class="file-upload-wrapper" [class.has-file]="member.idProofFile">
                      <div class="file-upload-content" *ngIf="!member.idProofPreview">
                         <i class="fas fa-cloud-upload-alt"></i>
                         <span>Drag & drop or click to upload ID</span>
                      </div>
                      
                      <div class="file-preview" *ngIf="member.idProofPreview">
                         <img [src]="member.idProofPreview" alt="ID Preview">
                         <div class="file-overlay">
                            <span><i class="fas fa-edit"></i> Change File</span>
                         </div>
                      </div>

                      <input type="file" class="file-input-overlay" (change)="onFileChange(\$event, i)" name="memberIdProof_{{i}}" accept="image/*" [required]="!showPayment && !member.idProofFile">
                   </div>
                </div>
);

fs.writeFileSync(file, data, 'utf8');
console.log('Fixed HTML inputs');
