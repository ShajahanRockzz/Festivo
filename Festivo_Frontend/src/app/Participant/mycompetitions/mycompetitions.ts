
import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-mycompetitions',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule],
  templateUrl: './mycompetitions.html',
  styleUrl: './mycompetitions.scss',
})
export class Mycompetitions implements OnInit, OnDestroy {

  ngOnDestroy() {
    document.body.style.overflow = 'auto';
  }

  groupedFests: any[] = [];
  selectedFest: any = null;
  searchTerm: string = '';
  statusFilter: string = 'all';
  isLoading = true;
  errorMessage = '';

  leaderboardVisible = false;
  leaderboardData: any[] = [];
  selectedCompetitionForLeaderboard: any = null;
  isLeaderboardLoading = false;

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

    this.http.get(`http://localhost:3000/api/participants/my-registrations/${participantId}`).subscribe({
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
      // Normalize position format depending on DB values
      if (reg.position == '1' || reg.position === 1) reg.position = 'First';
      else if (reg.position == '2' || reg.position === 2) reg.position = 'Second';
      else if (reg.position == '3' || reg.position === 3) reg.position = 'Third';

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

  selectFest(fest: any) {
    this.selectedFest = fest;
    this.searchTerm = '';
    this.statusFilter = 'all';
  }

  get filteredCompetitions() {
    if (!this.selectedFest) return [];
    return this.selectedFest.competitions.filter((c: any) => {
      const matchesSearch = c.competition_name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesFilter = this.statusFilter === 'all' || 
                            (this.statusFilter === 'published' && c.res_status === 'published') ||
                            (this.statusFilter === 'pending' && c.res_status !== 'published');
      return matchesSearch && matchesFilter;
    });
  }

  goBack() {
    this.selectedFest = null;
  }

  getFestImage(imagePath: string | undefined): string {
    if (!imagePath) {
      return 'http://localhost:3000/uploads/default_fest.jpg';
    }
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `http://localhost:3000/uploads/${imagePath}`;
  }

  getCompetitionImage(imagePath: string | undefined): string {
    if (!imagePath) {
      return 'http://localhost:3000/uploads/default_competition.jpg';
    }
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `http://localhost:3000/uploads/${imagePath}`;
  }

  viewLeaderboard(comp: any) {
    this.selectedCompetitionForLeaderboard = comp;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.overflow = 'hidden';
    this.leaderboardVisible = true;
    this.isLeaderboardLoading = true;
    this.leaderboardData = [];
    this.cdr.detectChanges();

    this.http.get(`http://localhost:3000/api/competitions/${comp.competitionid}/participants-with-results`).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          // Map DB positions ('1', '2', '3') to 'First', 'Second', 'Third'
          this.leaderboardData = res.data.filter((r: any) => r.position)
            .map((r: any) => {
               if(r.position == '1') r.position = 'First';
               else if(r.position == '2') r.position = 'Second';
               else if(r.position == '3') r.position = 'Third';
               return r;
            })
            .filter((r: any) => ['First', 'Second', 'Third'].includes(r.position))
            .sort((a: any, b: any) => {
              const ranks: any = { 'First': 1, 'Second': 2, 'Third': 3 };
              return ranks[a.position] - ranks[b.position];
            });
        }
        this.isLeaderboardLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching leaderboard', err);
        this.isLeaderboardLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  closeLeaderboard() {
    this.leaderboardVisible = false;
    document.body.style.overflow = 'auto';
    this.selectedCompetitionForLeaderboard = null;
    this.leaderboardData = [];
  }

  downloadCertificate(comp: any) {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background Setup
    ctx.fillStyle = '#1e293b'; // slate-800
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative Borders
    ctx.strokeStyle = '#0ea5e9'; // sky-500
    ctx.lineWidth = 15;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    
    ctx.strokeStyle = '#38bdf8'; // sky-400
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    // Gold accent rects in corners
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(40, 40, 30, 30);
    ctx.fillRect(canvas.width - 70, 40, 30, 30);
    ctx.fillRect(40, canvas.height - 70, 30, 30);
    ctx.fillRect(canvas.width - 70, canvas.height - 70, 30, 30);

    ctx.textAlign = 'center';

    // Header
    ctx.font = 'bold 50px Arial';
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#38bdf8');
    gradient.addColorStop(1, '#818cf8');
    ctx.fillStyle = gradient;
    ctx.fillText('CERTIFICATE OF EXCELLENCE', canvas.width / 2, 140);

    ctx.fillStyle = '#cbd5e1'; // slate-300
    ctx.font = '24px Arial';
    ctx.fillText('This is proudly presented to', canvas.width / 2, 220);

    // Participant Name
    let userName = 'Participant';
    try {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            const userObj = JSON.parse(storedUser);
            userName = userObj.name || userObj.username || 'Participant';
        }
    } catch(e) {}

    ctx.fillStyle = '#f8fafc'; // slate-50
    ctx.font = 'bold 44px Arial';
    ctx.fillText(userName, canvas.width / 2, 290);

    // Line under name
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 200, 310);
    ctx.lineTo(canvas.width / 2 + 200, 310);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '24px Arial';
    ctx.fillText('for achieving', canvas.width / 2, 360);

    // Position
    const positionColors: any = {
        'First': '#fbbf24', // amber-400
        'Second': '#e2e8f0', // slate-200
        'Third': '#d97706' // amber-600
    };
    ctx.fillStyle = positionColors[comp.position] || '#f8fafc';
    ctx.font = 'bold 40px Arial';
    ctx.fillText(`${comp.position} Position`.toUpperCase(), canvas.width / 2, 420);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '24px Arial';
    ctx.fillText(`in ${comp.competition_name}`, canvas.width / 2, 480);
    
    // Fest name
    const festName = this.selectedFest?.fest_name || 'the event';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px Arial';
    ctx.fillText(`at ${festName}`, canvas.width / 2, 530);

    // Date
    const d = new Date(comp.competition_date);
    ctx.fillText(`Date: ${d.toLocaleDateString()}`, canvas.width / 2, 580);

    // Footer Signatures
    ctx.font = '18px Arial';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('_________________', canvas.width / 4, 620);
    ctx.fillText('Coordinator', canvas.width / 4, 650);

    ctx.fillText('_________________', (canvas.width / 4) * 3, 620);
    ctx.fillText('Institution Head', (canvas.width / 4) * 3, 650);

    // Trigger Download as PDF
    const imgData = canvas.toDataURL('image/png');
    
    // A4 landscape orientation dimensions: 297mm x 210mm
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Add canvas image exactly filling the landscape A4 page
    pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
    
    // Save to user's computer
    pdf.save(`${userName.replace(/\s+/g, '_')}_${comp.competition_name.replace(/\s+/g, '_')}_Certificate.pdf`);
  }
}
