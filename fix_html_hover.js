const fs = require('fs');
const file = 'Festivo_Frontend/src/app/Participant/registercompetition/registercompetition.html';
let data = fs.readFileSync(file, 'utf8');

data = data.replace(
  '<img [src]="member.idProofPreview" alt="ID Preview" style="width:100%;height:100px;object-fit:contain;border-radius:8px;">',
  '<img [src]="member.idProofPreview" alt="ID Preview" style="width:100%;height:100px;object-fit:contain;border-radius:8px;">\n                         <div class="file-overlay" style="position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;justify-content:center;align-items:center;border-radius:8px;opacity:0;transition:0.3s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0">\n                            <span style="color:white;font-weight:600;"><i class="fas fa-edit"></i> Change File</span>\n                         </div>'
);

fs.writeFileSync(file, data, 'utf8');
console.log('Fixed HTML hover');
