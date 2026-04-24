const fs = require('fs');
const tsPath = 'C:/Users/shaja/OneDrive/Desktop/Santhigiri/S6/Main Project/Project/Festivo/Festivo_Frontend/src/app/Participant/mycompetitions/mycompetitions.ts';

const tsContext = `
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-mycompetitions',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './mycompetitions.html',
  styleUrl: './mycompetitions.scss',
})
export class Mycompetitions implements OnInit {
  groupedFests: any[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCompetitions();
  }

  loadCompetitions() {
    this.isLoading = true;
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const participantId = currentUser.participantid;

    if (!participantId) {
        this.errorMessage = 'You need to be logged in to view your competitions.';
        this.isLoading = false;
        this.cdr.detectChanges();
        return;
    }

    this.http.get(\`http://localhost:3000/api/participants/my-registrations/\${participantId}\`).subscribe({
        next: (res: any) => {
            if (res.success) {
                this.groupCompetitionsByFest(res.data);
            } else {
                this.errorMessage = res.message || 'Failed to load competitions';
            }
            this.isLoading = false;
            this.cdr.detectChanges();
        },
        error: (err) => {
            console.error('Fetch error', err);
            this.errorMessage = 'An error occurred while linking to the server.';
            this.isLoading = false;
            this.cdr.detectChanges();
        }
    });
  }

  groupCompetitionsByFest(registrations: any[]) {
    // Grouping logic
    const festsMap = new Map();
    registrations.forEach(reg => {
      const festId = reg.fest_id;
      if (!festsMap.has(festId)) {
        festsMap.set(festId, {
          fest_id: festId,
          fest_name: reg.fest_name,
          institution_name: reg.institution_name,
          competitions: []
        });
      }
      festsMap.get(festId).competitions.push(reg);
    });

    this.groupedFests = Array.from(festsMap.values());
  }

  getFestImage(imagePath: string | undefined): string {
    if (!imagePath) {
      return 'http://localhost:3000/uploads/default_fest.jpg';
    }
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return \`http://localhost:3000/uploads/\${imagePath}\`;
  }
}
`;

fs.writeFileSync(tsPath, tsContext);
console.log('TS File Written!');
