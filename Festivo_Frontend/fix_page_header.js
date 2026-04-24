const fs = require('fs');

const scssPath = 'src/app/Institution/buyplan/buyplan.scss';
let scss = fs.readFileSync(scssPath, 'utf8');

// Replace .page-header styles to make sure padding is good and it matches current theme.
// The image shows the text looks okay but the background is a bright light blue linear gradient which clashes with UI, let's fix it.
const pageHeaderRegex = /\.page-header\s*\{[\s\S]*?\}\s*\}/;

const newPageHeader = `.page-header {
  padding: 40px 50px;
  background: transparent;
  color: var(--text-pure, white);
  margin-bottom: 0px;

  h1 {
    margin: 0;
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 12px;
    color: var(--text-pure, white);
    letter-spacing: -0.5px;
  }

  .subtitle {
    margin: 0;
    font-size: 16px;
    color: var(--text-slate, #94a3b8);
    opacity: 1;
    font-weight: 400;
    text-transform: none;
    letter-spacing: 0;
  }
}`;

if (scss.match(pageHeaderRegex)) {
  scss = scss.replace(pageHeaderRegex, newPageHeader);
  fs.writeFileSync(scssPath, scss);
  console.log("SCSS updated");
} else {
  console.log("Could not find .page-header block");
}
