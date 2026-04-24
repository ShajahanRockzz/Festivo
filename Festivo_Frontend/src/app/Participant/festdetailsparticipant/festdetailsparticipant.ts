import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface FestDetails {
  fest_id: number;
  fest_name: string;
  fest_description: string;
  fest_image: string;
  brochure: string | null;
  startdate: Date;
  enddate: Date;
  fest_for: string;
  category_name: string;
  institution_name: string;
  institution_email: string;
  institution_address: string;
  institution_contact: string;
  institution_pincode: string;
  event_count: number;
}

interface Competition {
  competition_id: number;
  competition_name: string;
  description: string;
  type: string;
  competition_date: Date;
  reg_fee: number;
  image: string | null;
}

@Component({
  selector: 'app-Festdetailsparticipant',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './festdetailsparticipant.html',
  styleUrl: './festdetailsparticipant.scss'
})
export class Festdetailsparticipant implements OnInit {
  festId: string | null = null;
  festDetails: FestDetails | null = null;
  competitions: Competition[] = [];
  isLoading: boolean = true;

  showDetailsModal: boolean = false;
  selectedCompDetails: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.festId = this.route.snapshot.paramMap.get('id');
    if (this.festId) {
      this.loadFestDetails();
      this.loadCompetitions();
    }
  }

  loadFestDetails() {
    this.http.get<any>('http://localhost:3000/api/fest/guest/details/' + this.festId).subscribe({
      next: (res) => {
        if (res.success) {
          this.festDetails = res.data;
          console.log('Got fest data!', res.data);
        }
        this.isLoading = false;
        console.log('Set isLoading to false');
        this.cdr.detectChanges(); // Force Angular to update the UI
      },
      error: (err) => {
        console.error('Error fetching fest details', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadCompetitions() {
    this.http.get<any>('http://localhost:3000/api/competitions/fest/' + this.festId).subscribe({
      next: (res) => {
        if (res.success) {
          this.competitions = res.data;
          this.cdr.detectChanges(); // Force UI update after competitions arrive
        }
      },
      error: (err) => console.error('Error fetching competitions', err)
    });
  }

  getImageUrl(imageName: string | null | undefined, type: 'fest' | 'comp' = 'fest'): string {
    if (imageName) {
      return 'http://localhost:3000/uploads/' + imageName;
    }
    return type === 'fest' 
      ? 'http://localhost:3000/uploads/default_fest.jpg' 
      : 'http://localhost:3000/uploads/default_competition.jpg';

  }

  getBrochureUrl(fileName: string): string {
    return 'http://localhost:3000/uploads/' + fileName;
  }

registerNow(compId: number) {
    this.router.navigate(['/participantmaster/registercompetition', compId]);
  }

  isRegistrationClosed(dateStr: Date | string): boolean {
    if (!dateStr) return false;
    const compDate = new Date(dateStr);
    const today = new Date();
    
    // Reset time to compare only the dates
    compDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    return today >= compDate;
  }

  viewDetails(comp: any) {
    this.router.navigate(['/participantmaster/viewcompetitindetailsparticiapant', comp.competition_id]);
  }



}

