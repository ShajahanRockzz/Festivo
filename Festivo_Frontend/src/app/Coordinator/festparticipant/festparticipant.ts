import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

interface Participant {
  competitionregid: number;
  participantid: number;
  participantname: string;
  participantemail: string;
  contact_no: string;
  competitionid: number;
  chessno: number;
  attendance: string;
  regdate: string;
  participantimage?: string; // Participant's profile image
  institution_id_proof?: string; // Participant's ID proof
  assignedPosition?: string; // Track assigned position for this participant
  groupMembers?: GroupMember[]; // Group members if this is a group competition
}

interface GroupMember {
  participantname: string;
  collegeidproof: string;
  contact_no: string;
  email: string;
  institution_name?: string; // Institution name if participant is a student
}

interface Result {
  result_id: number;
  competition_reg_id: number;
  position: string;
}

@Component({
  selector: 'app-festparticipant',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './festparticipant.html',
  styleUrl: './festparticipant.scss',
})
export class Festparticipant implements OnInit {
  isLoading = true;
  participants: Participant[] = [];
  filteredParticipants: Participant[] = [];
  competitionId: number = 0;
  competitionName: string = '';
  coordinatorId: number = 0;
  selectedParticipant: Participant | null = null;
  editingChessNo: { [key: number]: boolean } = {};
  editingAttendance: { [key: number]: boolean } = {};
  editingResult: { [key: number]: boolean } = {};
  expandedCards: { [key: number]: boolean } = {}; // Track expanded/collapsed state
  errorMessage = '';
  successMessage = '';
  selectedResults: { [key: number]: string } = {};
  searchQuery: string = '';
  activeTab: 'all' | 'chess' | 'attendance' | 'result' = 'all';
  bulkStartingNumber: number | null = null;
  bulkAssigning = false;
  bulkAttendanceValue: string | null = null;
  bulkAssigningAttendance = false;
  isResultPublished = false; // Track if results are published
  competitionType: string = 'single'; // Track competition type (single or group)

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    let loginId = 0;

    if (currentUser) {
      loginId = currentUser.loginId || currentUser.login_id || 0;
    } else {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          loginId = user.loginId || user.login_id || 0;
        } catch (e) {
          console.error('Error parsing stored user:', e);
        }
      }
    }

    if (loginId > 0) {
      this.http.get<any>(`http://localhost:3000/api/coordinators/by-login/${loginId}`).subscribe({
        next: (response) => {
          this.coordinatorId = response.coordinator_id || 0;
          this.loadCompetitionData();
        },
        error: (err) => {
          console.error('Error fetching coordinator ID:', err);
          this.isLoading = false;
          this.errorMessage = 'Failed to load coordinator information';
        }
      });
    }
  }

  loadCompetitionData(): void {
    this.competitionId = parseInt(this.route.snapshot.paramMap.get('competitionId') || '0');

    if (this.competitionId === 0) {
      this.router.navigate(['/coordinatormaster/viewassignedfests']);
      return;
    }

    // Get competition name and status
    this.http.get<any>(`http://localhost:3000/api/competitions/${this.competitionId}`).subscribe({
      next: (response) => {
        // Handle both wrapped and unwrapped responses
        const competitionData = response.data || response;
        this.competitionName = competitionData.competition_name || 'Competition';
        this.competitionType = competitionData.type || 'single';
        console.log('Competition data:', competitionData);
        console.log('Result status:', competitionData.res_status);
        // Check if results are published
        this.isResultPublished = competitionData.res_status === 'published';
        console.log('isResultPublished set to:', this.isResultPublished);
        this.cdr.detectChanges();
        this.loadParticipants();
      },
      error: (err) => {
        console.error('Error fetching competition:', err);
        this.loadParticipants();
      }
    });
  }

  loadParticipants(): void {
    this.http.get<any>(`http://localhost:3000/api/competitions/${this.competitionId}/participants`).subscribe({
      next: (response) => {
        const participants = response.data || response || [];
        this.participants = participants;
        this.filteredParticipants = [...this.participants];
        // Initialize editing states and load assigned positions
        this.participants.forEach(p => {
          this.editingChessNo[p.competitionregid] = false;
          this.editingAttendance[p.competitionregid] = false;
          this.editingResult[p.competitionregid] = false;
          this.selectedResults[p.competitionregid] = '';
          // Fetch existing result for this participant
          this.http.get<Result>(`http://localhost:3000/api/participants/result/${p.competitionregid}`).subscribe({
            next: (result) => {
              if (result) {
                p.assignedPosition = result.position;
                this.selectedResults[p.competitionregid] = result.position;
              }
            },
            error: () => { /* No result found, that's ok */ }
          });
        });
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading participants:', error);
        this.isLoading = false;
        this.errorMessage = 'Failed to load participants';
        this.cdr.detectChanges();
      }
    });
  }

  filterParticipants(): void {
    if (!this.searchQuery.trim()) {
      this.filteredParticipants = [...this.participants];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredParticipants = this.participants.filter(p =>
        p.participantname.toLowerCase().includes(query) ||
        p.participantemail.toLowerCase().includes(query) ||
        p.contact_no.includes(query)
      );
    }
    this.cdr.detectChanges();
  }

  setActiveTab(tab: 'all' | 'chess' | 'attendance' | 'result'): void {
    this.activeTab = tab;
    this.cdr.detectChanges();
  }

  toggleEditChessNo(regId: number): void {
    if (this.isResultPublished) {
      this.errorMessage = 'Cannot edit: Results have been published';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }
    this.editingChessNo[regId] = !this.editingChessNo[regId];
    this.cdr.detectChanges();
  }

  toggleEditAttendance(regId: number): void {
    if (this.isResultPublished) {
      this.errorMessage = 'Cannot edit: Results have been published';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }
    this.editingAttendance[regId] = !this.editingAttendance[regId];
    this.cdr.detectChanges();
  }

  toggleEditResult(regId: number): void {
    if (this.isResultPublished) {
      this.errorMessage = 'Cannot edit: Results have been published';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }
    this.editingResult[regId] = !this.editingResult[regId];
    // Pre-populate the selected result with existing position if editing
    if (this.editingResult[regId]) {
      const participant = this.participants.find(p => p.competitionregid === regId);
      if (participant && participant.assignedPosition) {
        this.selectedResults[regId] = participant.assignedPosition;
      }
    }
    this.cdr.detectChanges();
  }

  saveChessNo(participant: Participant): void {
    if (this.isResultPublished) {
      this.errorMessage = 'Cannot edit: Results have been published';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }
    
    const data = {
      competition_reg_id: participant.competitionregid,
      chessno: participant.chessno
    };

    this.http.put(`http://localhost:3000/api/participants/chess-no/${participant.competitionregid}`, data).subscribe({
      next: (response: any) => {
        this.successMessage = 'Chess number updated successfully';
        this.editingChessNo[participant.competitionregid] = false;
        setTimeout(() => this.successMessage = '', 2000);
      },
      error: (error) => {
        console.error('Error updating chess number:', error);
        this.errorMessage = 'Failed to update chess number';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  saveAttendance(participant: Participant): void {
    if (this.isResultPublished) {
      this.errorMessage = 'Cannot edit: Results have been published';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }
    
    const data = {
      competition_reg_id: participant.competitionregid,
      attendance: participant.attendance
    };

    this.http.put(`http://localhost:3000/api/participants/attendance/${participant.competitionregid}`, data).subscribe({
      next: (response: any) => {
        this.successMessage = 'Attendance updated successfully';
        this.editingAttendance[participant.competitionregid] = false;
        this.cdr.detectChanges();
        setTimeout(() => this.successMessage = '', 2000);
      },
      error: (error) => {
        console.error('Error updating attendance:', error);
        this.errorMessage = 'Failed to update attendance';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  saveResult(participant: Participant): void {
    if (this.isResultPublished) {
      this.errorMessage = 'Cannot edit: Results have been published';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }
    
    // Clear previous messages
    this.errorMessage = '';
    this.successMessage = '';
    
    const position = this.selectedResults[participant.competitionregid];

    console.log('Saving result. Position:', position, 'Type:', typeof position, 'CompRegId:', participant.competitionregid);

    if (!position || position.trim() === '') {
      this.errorMessage = 'Please select a position';
      setTimeout(() => this.errorMessage = '', 3000);
      this.cdr.detectChanges();
      return;
    }

    const positionNumber = parseInt(position);
    const totalParticipants = this.filteredParticipants.length > 0 ? this.filteredParticipants.length : this.participants.length;

    // Validate position is not greater than total participants
    if (positionNumber > totalParticipants) {
      this.errorMessage = `Position cannot be greater than total participants (${totalParticipants})`;
      setTimeout(() => this.errorMessage = '', 3000);
      this.cdr.detectChanges();
      return;
    }

    // Check if this position is already assigned to another participant
    const isPositionTaken = this.participants.some(p => 
      p.competitionregid !== participant.competitionregid && 
      p.assignedPosition === position
    );

    if (isPositionTaken) {
      this.errorMessage = `Position ${position} is already assigned to another participant`;
      setTimeout(() => this.errorMessage = '', 3000);
      this.cdr.detectChanges();
      return;
    }

    const data = {
      competition_id: this.competitionId,
      competition_reg_id: participant.competitionregid,
      position: position
    };

    console.log('Sending result data:', data);

    this.http.post(`http://localhost:3000/api/participants/result`, data).subscribe({
      next: (response: any) => {
        console.log('Result saved response:', response);
        this.successMessage = 'Result saved successfully';
        participant.assignedPosition = position;
        this.editingResult[participant.competitionregid] = false;
        this.cdr.detectChanges();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error saving result:', error);
        this.errorMessage = error.error?.message || 'Failed to save result';
        this.cdr.detectChanges();
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  bulkAssignAttendance(): void {
    if (this.isResultPublished) {
      this.errorMessage = 'Cannot edit: Results have been published';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }
    
    if (!this.bulkAttendanceValue) {
      this.errorMessage = 'Please select an attendance status';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    const participantsToUpdate = this.filteredParticipants.length > 0 ? this.filteredParticipants : this.participants;

    if (participantsToUpdate.length === 0) {
      this.errorMessage = 'No participants to assign';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    this.bulkAssigningAttendance = true;
    let updateCount = 0;
    let errorCount = 0;

    // Assign attendance status to all participants
    participantsToUpdate.forEach(participant => {
      participant.attendance = this.bulkAttendanceValue!;
    });

    // Save all participants in batch
    const savePromises = participantsToUpdate.map(participant => {
      const data = {
        competition_reg_id: participant.competitionregid,
        attendance: participant.attendance
      };

      return new Promise<void>((resolve) => {
        this.http.put(`http://localhost:3000/api/participants/attendance/${participant.competitionregid}`, data).subscribe({
          next: () => {
            updateCount++;
            resolve();
          },
          error: () => {
            errorCount++;
            resolve();
          }
        });
      });
    });

    Promise.all(savePromises).then(() => {
      this.bulkAssigningAttendance = false;
      this.bulkAttendanceValue = null;

      if (errorCount === 0) {
        this.successMessage = `Successfully updated attendance for ${updateCount} participant(s)`;
        setTimeout(() => this.successMessage = '', 3000);
      } else {
        this.successMessage = `Updated ${updateCount} participant(s), ${errorCount} failed`;
        setTimeout(() => this.successMessage = '', 3000);
      }
      this.cdr.detectChanges();
    });
  }

  goBack(): void {
    this.router.navigate(['/coordinatormaster/viewfestcompetitions', this.route.snapshot.paramMap.get('festId')]);
  }

  getPositionSuffix(position: number): string {
    if (position % 100 >= 11 && position % 100 <= 13) {
      return 'th';
    }
    switch (position % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }

  formatPositionDisplay(position: string): string {
    const posNum = parseInt(position);
    return `${posNum}${this.getPositionSuffix(posNum)} Position`;
  }

  getMaxPosition(): number {
    return this.filteredParticipants.length > 0 ? this.filteredParticipants.length : this.participants.length;
  }

  getPositionArray(): number[] {
    const maxPosition = this.getMaxPosition();
    // Return positions from 1 to maxPosition (equal to total participants)
    return Array.from({ length: maxPosition }, (_, i) => i + 1);
  }

  getAvailablePositions(currentParticipant: Participant): number[] {
    const allPositions = this.getPositionArray();
    // Return positions that are either not taken or already assigned to this participant
    return allPositions.filter(pos => {
      const posStr = pos.toString();
      const isTaken = this.participants.some(p => 
        p.competitionregid !== currentParticipant.competitionregid && 
        p.assignedPosition === posStr
      );
      return !isTaken;
    });
  }

  bulkAssignChessNumbers(): void {
    if (this.isResultPublished) {
      this.errorMessage = 'Cannot edit: Results have been published';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }
    
    if (!this.bulkStartingNumber || this.bulkStartingNumber < 1) {
      this.errorMessage = 'Please enter a valid starting number';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    const participantsToUpdate = this.filteredParticipants.length > 0 ? this.filteredParticipants : this.participants;

    if (participantsToUpdate.length === 0) {
      this.errorMessage = 'No participants to assign';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    this.bulkAssigning = true;
    let chessNumber = this.bulkStartingNumber;
    let updateCount = 0;
    let errorCount = 0;

    // Assign sequential chess numbers
    participantsToUpdate.forEach((participant, index) => {
      participant.chessno = chessNumber + index;
    });

    // Save all participants in batch
    const savePromises = participantsToUpdate.map(participant => {
      const data = {
        competition_reg_id: participant.competitionregid,
        chessno: participant.chessno
      };

      return new Promise<void>((resolve) => {
        this.http.put(`http://localhost:3000/api/participants/chess-no/${participant.competitionregid}`, data).subscribe({
          next: () => {
            updateCount++;
            resolve();
          },
          error: () => {
            errorCount++;
            resolve();
          }
        });
      });
    });

    Promise.all(savePromises).then(() => {
      this.bulkAssigning = false;
      this.bulkStartingNumber = null;

      if (errorCount === 0) {
        this.successMessage = `Successfully assigned chess numbers to ${updateCount} participant(s)`;
        setTimeout(() => this.successMessage = '', 3000);
      } else {
        this.successMessage = `Assigned to ${updateCount} participant(s), ${errorCount} failed`;
        setTimeout(() => this.successMessage = '', 3000);
      }
      this.cdr.detectChanges();
    });
  }

  deleteResult(participant: Participant): void {
    if (this.isResultPublished) {
      this.errorMessage = 'Cannot delete: Results have been published';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }
    
    if (confirm('Are you sure you want to delete this result?')) {
      // First fetch the result to get the result_id
      this.http.get<Result>(`http://localhost:3000/api/participants/result/${participant.competitionregid}`).subscribe({
        next: (result) => {
          if (result && result.result_id) {
            // Delete the result
            this.http.delete(`http://localhost:3000/api/participants/result/${result.result_id}`).subscribe({
              next: () => {
                this.successMessage = 'Result deleted successfully';
                participant.assignedPosition = undefined;
                this.selectedResults[participant.competitionregid] = '';
                this.cdr.detectChanges();
                setTimeout(() => this.successMessage = '', 3000);
              },
              error: (error) => {
                console.error('Error deleting result:', error);
                this.errorMessage = 'Failed to delete result';
                this.cdr.detectChanges();
                setTimeout(() => this.errorMessage = '', 3000);
              }
            });
          }
        },
        error: () => {
          this.errorMessage = 'Result not found';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
  }

  toggleCardExpand(participantId: number): void {
    this.expandedCards[participantId] = !this.expandedCards[participantId];
    this.cdr.detectChanges();
  }

  isPdf(filename: string | undefined): boolean {
    if (!filename) return false;
    return filename.toLowerCase().endsWith('.pdf');
  }

  // Image error handlers for fallback images
  onProfileImageError(event: any): void {
    event.target.src = 'http://localhost:3000/uploads/default_user.avif';
  }

  onIdProofImageError(event: any): void {
    const container = event.target.parentElement;
    if (container) {
      container.innerHTML = '<div class="proof-not-found">📷 ID Proof Not Found</div>';
    }
  }

  onGroupMemberIdProofError(event: any): void {
    const container = event.target.parentElement;
    if (container) {
      container.innerHTML = '<div class="proof-not-found-small">📷 Not Found</div>';
    }
  }
}

