const fs = require('fs');
const htmlPath = 'C:/Users/shaja/OneDrive/Desktop/Santhigiri/S6/Main Project/Project/Festivo/Festivo_Frontend/src/app/Participant/registrationdetails/registrationdetails.html';
const scssPath = 'C:/Users/shaja/OneDrive/Desktop/Santhigiri/S6/Main Project/Project/Festivo/Festivo_Frontend/src/app/Participant/registrationdetails/registrationdetails.scss';

let html = fs.readFileSync(htmlPath, 'utf8');

// Event Intel
html = html.replace(
  '<div class="glass-bento p-4 h-100 bento-card-hover">\r\n          <h4 class="text-white mb-4 border-bottom border-light pb-2">Event Intel</h4>',
  '<div class="glass-bento p-4 h-100 bento-card-hover intel-card">\r\n          <h4 class="text-white mb-4 border-bottom border-light pb-2">Event Intel</h4>'
);
html = html.replace(
  '<div class="glass-bento p-4 h-100 bento-card-hover">\n          <h4 class="text-white mb-4 border-bottom border-light pb-2">Event Intel</h4>',
  '<div class="glass-bento p-4 h-100 bento-card-hover intel-card">\n          <h4 class="text-white mb-4 border-bottom border-light pb-2">Event Intel</h4>'
);

// Attendance, Results & Rules splitting
const rightColStartRegex = /<!-- Center Column: Status & Rules -->[\s\S]*?<div class="col-lg-8">[\s\S]*?<div class="glass-bento p-4 h-100 bento-card-hover">[\s\S]*?<div class="row">[\s\S]*?<div class="col-md-6 mb-4">/;

html = html.replace(rightColStartRegex, `<!-- Center Column: Status & Rules -->
      <div class="col-lg-8">
        <div class="row g-4 mb-4">
          <div class="col-md-6">
            <div class="glass-bento p-4 h-100 bento-card-hover attendance-card">`);

html = html.replace(/<\/div>[\s\S]*?<div class="col-md-6 mb-4">[\s\S]*?<h4 class="text-white mb-3">Results<\/h4>/, `</div>
          </div>
          <div class="col-md-6">
            <div class="glass-bento p-4 h-100 bento-card-hover results-card">
              <h4 class="text-white mb-3">Results</h4>`);

html = html.replace(/<\/div>[\s\S]*?<\/div>[\s\S]*?<h4 class="text-white mb-3 mt-4 border-bottom border-light pb-2">Rules & Guidelines<\/h4>/, `</div>
          </div>
        </div>

        <div class="glass-bento p-4 bento-card-hover rules-card">
          <h4 class="text-white mb-3 border-bottom border-light pb-2">Rules & Guidelines</h4>`);

html = html.replace(/<\/div>\s*<\/div>\s*<\/div>\s*<!-- Group Members Section/g, `</div>\n      </div>\n    </div>\n\n    <!-- Group Members Section`);

fs.writeFileSync(htmlPath, html);
console.log('HTML Layout Updated!');

let scss = fs.readFileSync(scssPath, 'utf8');
const newStyles = `

/* Section Distinctions */
.intel-card {
  border-left: 4px solid #00f3ff !important;
  background: linear-gradient(90deg, rgba(0,243,255,0.05), rgba(15,23,42,0.6)) !important;
}
.intel-card:hover { border-color: rgba(0,243,255,0.5) !important; box-shadow: 0 4px 20px rgba(0,243,255,0.15) !important; }

.attendance-card {
  border-left: 4px solid #00ff88 !important;
  background: linear-gradient(90deg, rgba(0,255,136,0.05), rgba(15,23,42,0.6)) !important;
}
.attendance-card:hover { border-color: rgba(0,255,136,0.5) !important; box-shadow: 0 4px 20px rgba(0,255,136,0.15) !important; }

.results-card {
  border-left: 4px solid #b200ff !important;
  background: linear-gradient(90deg, rgba(178,0,255,0.05), rgba(15,23,42,0.6)) !important;
}
.results-card:hover { border-color: rgba(178,0,255,0.5) !important; box-shadow: 0 4px 20px rgba(178,0,255,0.15) !important; }

.rules-card {
  border-left: 4px solid #facc15 !important;
  background: linear-gradient(90deg, rgba(250,204,21,0.05), rgba(15,23,42,0.6)) !important;
}
.rules-card:hover { border-color: rgba(250,204,21,0.5) !important; box-shadow: 0 4px 20px rgba(250,204,21,0.15) !important; }
`;

if(!scss.includes('.intel-card')) {
  fs.writeFileSync(scssPath, scss + newStyles);
  console.log('SCSS Styles Updated!');
}

