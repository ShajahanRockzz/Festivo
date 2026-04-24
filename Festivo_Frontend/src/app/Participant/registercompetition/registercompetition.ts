import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registercompetition',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registercompetition.html',
  styleUrl: './registercompetition.scss',
})
export class Registercompetition implements OnInit {
  competitionId: string | null = null;
  competitionDetails: any = null;
  isLoading = true;
  isSubmitting = false;
  currentUser: any = null;

  registrationFormModel = {
    notes: ''
  };

  groupMembers: any[] = [];
  minMembers = 1;
  maxMembers = 1;

  showPayment = false;
  showSuccessModal = false;
  showErrorModal = false;
  errorMessage = '';
  isExpiryInvalid = false;
  paymentDetails = {
    cardHolder: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
    }
    
    this.route.paramMap.subscribe(params => {
      this.competitionId = params.get('id');
      if (this.competitionId) {
        this.fetchCompetitionDetails();
      }
    });
  }

  fetchCompetitionDetails() {
    this.http.get<any>('http://localhost:3000/api/competitions/' + this.competitionId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.competitionDetails = res.data;
          if (this.competitionDetails.type === 'group') {
             this.minMembers = this.competitionDetails.min_members || 1;
             this.maxMembers = this.competitionDetails.max_members || 1;
             this.initializeGroupMembers();
          }
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching competition details:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  initializeGroupMembers() {
    this.groupMembers = [];
    const minExtraMembers = Math.max(0, this.minMembers - 1);
    for (let i = 0; i < minExtraMembers; i++) {
       this.addMember();
    }
  }

  addMember() {
    const maxExtraMembers = Math.max(0, this.maxMembers - 1);
    if (this.groupMembers.length < maxExtraMembers) {
      this.groupMembers.push({
         name: '',
         contact: '',
         email: '',
         idProofFile: null
      });
    }
  }

  removeMember(index: number) {
    const minExtraMembers = Math.max(0, this.minMembers - 1);
    if (this.groupMembers.length > minExtraMembers) {
      this.groupMembers.splice(index, 1);
    }
  }

  onFileChange(event: any, index: number) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.groupMembers[index].idProofFile = file;

      // Add image preview logic
      const reader = new FileReader();
      reader.onload = () => {
        this.ngZone.run(() => {
          this.groupMembers[index].idProofPreview = reader.result as string;
          this.cdr.detectChanges();
        });
      };
      reader.readAsDataURL(file);
    }
  }

  proceedToPayment() {
    this.showPayment = true;
  }

  submitRegistration() {
    this.isSubmitting = true;
    
    const formData = new FormData();
    formData.append('compId', this.competitionId!);
    formData.append('participantId', this.currentUser?.participantid?.toString() || '');
    formData.append('type', this.competitionDetails.type);
    
    if (this.competitionDetails.type === 'group') {
       this.groupMembers.forEach((member, index) => {
          formData.append('member_names[]', member.name);
          formData.append('member_contacts[]', member.contact);
          formData.append('member_emails[]', member.email);
          if (member.idProofFile) {
             formData.append('collegeidproof_' + index, member.idProofFile);
          }
       });
    }

    this.http.post('http://localhost:3000/api/competitions/register', formData).subscribe({
       next: (res: any) => {
          this.isSubmitting = false;
          if (res.success) {
             this.showSuccessModal = true;
          } else {
             this.errorMessage = res.message || 'Registration failed';
             this.showErrorModal = true;
          }
          this.cdr.detectChanges();
       },
       error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.message || 'Error occurred during registration';
          this.showErrorModal = true;
          console.error(err);
          this.cdr.detectChanges();
       }
    });
  }

  closeModalAndGoBack() {
    this.showSuccessModal = false;
    this.goBack();
  }

  closeErrorModal() {
    this.showErrorModal = false;
  }

  goBack() {
    if (this.competitionDetails && this.competitionDetails.fest_id) {
       this.router.navigate(['/participantmaster/festdetailsparticipant', this.competitionDetails.fest_id]);
    } else {
       this.router.navigate(['/participantmaster/viewallfests']);
    }
  }

  onContactChange(value: string, index: number) {
    if (!value) {
      this.groupMembers[index].contact = '';
      return;
    }
    // Strip non-digits and limit to exactly 10 characters
    this.groupMembers[index].contact = value.replace(/\D/g, '').substring(0, 10);
  }

  onCardNumberChange(value: string) {
    if (!value) {
      this.paymentDetails.cardNumber = '';
      return;
    }
    const cleanNum = value.replace(/\D/g, '').substring(0, 16);
    this.paymentDetails.cardNumber = cleanNum.match(/.{1,4}/g)?.join(' ') || cleanNum;
  }

  onExpiryDateChange(value: string) {
    if (!value) {
      this.paymentDetails.expiryDate = '';
      this.isExpiryInvalid = false;
      return;
    }
    const cleanDate = value.replace(/\D/g, '').substring(0, 4);
    if (cleanDate.length > 2) {
      let month = parseInt(cleanDate.substring(0, 2), 10);
      if (month > 12) month = 12;
      let monthStr = month.toString().padStart(2, '0');
      this.paymentDetails.expiryDate = monthStr + '/' + cleanDate.substring(2, 4);
    } else {
      this.paymentDetails.expiryDate = cleanDate;
    }

    if (this.paymentDetails.expiryDate.length === 5) {
      const parts = this.paymentDetails.expiryDate.split('/');
      const m = parseInt(parts[0], 10);
      const y = parseInt(parts[1], 10) + 2000;
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      if (y < currentYear || (y === currentYear && m < currentMonth)) {
        this.isExpiryInvalid = true;
      } else {
        this.isExpiryInvalid = false;
      }
    } else {
      this.isExpiryInvalid = false;
    }
  }

  onCvvChange(value: string) {
    if (!value) {
      this.paymentDetails.cvv = '';
      return;
    }
    this.paymentDetails.cvv = value.replace(/\D/g, '').substring(0, 3);
  }
}
