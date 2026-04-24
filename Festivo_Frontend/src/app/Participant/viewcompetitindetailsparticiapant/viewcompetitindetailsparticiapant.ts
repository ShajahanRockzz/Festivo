import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-viewcompetitindetailsparticiapant',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './viewcompetitindetailsparticiapant.html',
  styleUrl: './viewcompetitindetailsparticiapant.scss'
})
export class Viewcompetitindetailsparticiapant implements OnInit {
  compId: string | null = null;
  compDetails: any = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.compId = this.route.snapshot.paramMap.get('id');
    if (this.compId) {
      this.loadCompetitionDetails();
    }
  }

  loadCompetitionDetails() {
    this.http.get<any>('http://localhost:3000/api/competitions/' + this.compId).subscribe({
      next: (res) => {
        if (res.success) {
          this.compDetails = res.data;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching competition details', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getImageUrl(imageName: string | null | undefined): string {
    if (imageName) {
      return 'http://localhost:3000/uploads/' + imageName;
    }
    return 'http://localhost:3000/uploads/default_competition.jpg';
  }

  registerNow(compId: number) {
    this.router.navigate(['/participantmaster/registercompetition', compId]);   
  }

  isRegistrationClosed(dateStr: string): boolean {
    if (!dateStr) return false;
    const compDate = new Date(dateStr);
    const today = new Date();

    compDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return today >= compDate;
  }
}
