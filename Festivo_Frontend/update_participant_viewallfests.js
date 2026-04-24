const fs = require('fs');

let guestHtml = fs.readFileSync('src/app/Guest/viewallfestsguest/viewallfestsguest.html', 'utf8');
let guestScss = fs.readFileSync('src/app/Guest/viewallfestsguest/viewallfestsguest.scss', 'utf8');

guestHtml = guestHtml.replace(/goToFestDetails/g, 'viewFestDetails');
guestHtml = guestHtml.replace(/<i class="feather icon-search/g, '<i class="fa-solid fa-magnifying-glass');

fs.writeFileSync('src/app/Participant/viewallfests/viewallfests.html', guestHtml, 'utf8');
fs.writeFileSync('src/app/Participant/viewallfests/viewallfests.scss', guestScss, 'utf8');

console.log("Updated participant viewallfests visual HTML and SCSS from guest.");
