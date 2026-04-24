const fs = require('fs');

const files = [
  'src/app/Participant/contact/contact.html',
  'src/app/Guest/contact/contact.html'
];

const replaceMap = {
  'feather icon-check-circle': 'fa-regular fa-circle-check',
  'feather icon-search': 'fa-solid fa-magnifying-glass',
  'feather icon-alert-circle': 'fa-solid fa-circle-exclamation',
  'feather icon-send': 'fa-regular fa-paper-plane',
  'feather icon-map-pin': 'fa-solid fa-location-dot',
  'feather icon-mail': 'fa-regular fa-envelope',
  'feather icon-phone': 'fa-solid fa-phone',
  'feather icon-bookmark': 'fa-regular fa-bookmark',
  'feather icon-calendar': 'fa-regular fa-calendar',
  'feather icon-users': 'fa-solid fa-users',
  'feather icon-instagram': 'fa-brands fa-instagram',
  'feather icon-linkedin': 'fa-brands fa-linkedin-in',
  'feather icon-twitter': 'fa-brands fa-twitter'
};

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    for (const [feather, fontawesome] of Object.entries(replaceMap)) {
      // Create a regex to match the exact feather class phrase to avoid partial matches
      const regex = new RegExp(`class="feather ${feather.replace('feather ', '')}"`, 'g');
      content = content.replace(regex, `class="${fontawesome}"`);
    }
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated icons in ${file}`);
  }
});
