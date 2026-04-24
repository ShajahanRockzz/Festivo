const fs = require('fs');
let html = fs.readFileSync('src/app/Participant/participantmaster/participantmaster.html', 'utf8');

const oldNav = `<ul class="nav-list">
                                        <li><a routerLink="/participantmaster/participanthome" class="nav-link">Home</a></li>
                                        <li><a routerLink="/participantmaster/viewallfests" class="nav-link">Fests</a></li>
                                        <li><a routerLink="/participantmaster/contact" class="nav-link">My Registrations</a></li>
                      <li><a routerLink="/participantmaster/about" class="nav-link">My Competitions</a></li>
                                </ul>`;

const newNav = `<ul class="nav-list">
                                        <li><a routerLink="/participantmaster/participanthome" class="nav-link">Home</a></li>
                                        <li><a routerLink="/participantmaster/viewallfests" class="nav-link">Fests</a></li>
                                        <li><a routerLink="/participantmaster/about" class="nav-link">About Us</a></li>
                                        <li><a routerLink="/participantmaster/contact" class="nav-link">Contact</a></li>
                                </ul>`;

html = html.replace(oldNav, newNav);

// Sometimes line endings or spacing might cause mismatch, so let's do a more robust regex if needed
if (!html.includes('About Us')) {
    html = html.replace(/<ul class="nav-list">[\s\S]*?<\/ul>/, newNav);
}

fs.writeFileSync('src/app/Participant/participantmaster/participantmaster.html', html, 'utf8');
