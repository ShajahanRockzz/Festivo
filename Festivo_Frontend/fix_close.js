const fs = require('fs');
let f = fs.readFileSync('src/app/Participant/mycompetitions/mycompetitions.html', 'utf8');
let newBtn = <button type="button" class="btn text-white" style="background: transparent !important; border: none; box-shadow: none !important; opacity: 0.8; padding: 0.25rem;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.8" (click)="closeLeaderboard()"><i class="bi bi-x-lg fs-4 lh-1"></i></button>;
f = f.replace(/<button type="button" class="btn-close btn-close-white"[\s\n]*\(click\)="closeLeaderboard\(\)"><\/button>/m, newBtn);
fs.writeFileSync('src/app/Participant/mycompetitions/mycompetitions.html', f);
console.log('Done');
