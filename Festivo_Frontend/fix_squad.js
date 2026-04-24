const fs = require('fs');
const path = 'C:/Users/shaja/OneDrive/Desktop/Santhigiri/S6/Main Project/Project/Festivo/Festivo_Frontend/src/app/Participant/registrationdetails/registrationdetails.scss';
let scss = fs.readFileSync(path, 'utf8');

const regex = /\.squad-card\s*\{[\s\S]*\}\s*/;
const replacement = `
.squad-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(15, 23, 42, 0.6);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  }
}

/* Dynamically color wrap each squad member differently */
.row.g-3 > div:nth-child(5n + 1) .squad-card { 
    border-left: 4px solid #00f3ff; 
    background: linear-gradient(90deg, rgba(0,243,255,0.05), rgba(15,23,42,0.6)); 
    &:hover { box-shadow: 0 4px 20px rgba(0, 243, 255, 0.15); border-color: rgba(0, 243, 255, 0.2); }
    h5 i { color: #00f3ff !important; }
}
.row.g-3 > div:nth-child(5n + 2) .squad-card { 
    border-left: 4px solid #00ff88; 
    background: linear-gradient(90deg, rgba(0,255,136,0.05), rgba(15,23,42,0.6)); 
    &:hover { box-shadow: 0 4px 20px rgba(0, 255, 136, 0.15); border-color: rgba(0, 255, 136, 0.2); }
    h5 i { color: #00ff88 !important; }
}
.row.g-3 > div:nth-child(5n + 3) .squad-card { 
    border-left: 4px solid #b200ff; 
    background: linear-gradient(90deg, rgba(178,0,255,0.05), rgba(15,23,42,0.6)); 
    &:hover { box-shadow: 0 4px 20px rgba(178, 0, 255, 0.15); border-color: rgba(178, 0, 255, 0.2); }
    h5 i { color: #b200ff !important; }
}
.row.g-3 > div:nth-child(5n + 4) .squad-card { 
    border-left: 4px solid #facc15; 
    background: linear-gradient(90deg, rgba(250,204,21,0.05), rgba(15,23,42,0.6)); 
    &:hover { box-shadow: 0 4px 20px rgba(250, 204, 21, 0.15); border-color: rgba(250, 204, 21, 0.2); }
    h5 i { color: #facc15 !important; }
}
.row.g-3 > div:nth-child(5n + 5) .squad-card { 
    border-left: 4px solid #ff3366; 
    background: linear-gradient(90deg, rgba(255,51,102,0.05), rgba(15,23,42,0.6)); 
    &:hover { box-shadow: 0 4px 20px rgba(255, 51, 102, 0.15); border-color: rgba(255, 51, 102, 0.2); }
    h5 i { color: #ff3366 !important; }
}
`;

scss = scss.replace(regex, replacement);
fs.writeFileSync(path, scss);
console.log('Colored Squad Setup Added');
