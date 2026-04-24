import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

interface Institution {
  institution_id: number;
  institution_name: string;
  institution_email: string;
  institution_address: string;
  institution_contactno: string;
  institution_image: string;
  websiteaddress: string;
  login_id: number;
  status: string;
}

interface Coordinator {
  coordinator_id: number;
  name: string;
  email: string;
  contact_no: string;
  institution_id: number;
  institution_name: string;
  image: string;
  login_id: number;
  status: string;
}

interface Participant {
  participantid: number;
  participantname: string;
  participantemail: string;
  contact_no: string;
  academic_status: string;
  institution_name: string;
  participantimage: string;
  loginid: number;
  status: string;
}

@Component({
  selector: 'app-viewallusers',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './viewallusers.html',
  styleUrl: './viewallusers.scss',
})
export class Viewallusers implements OnInit {
  // Active Tab
  activeTab: 'institutions' | 'coordinators' | 'participants' = 'institutions';

  // Data Arrays
  institutions: Institution[] = [];
  coordinators: Coordinator[] = [];
  participants: Participant[] = [];

  // Filtered Data Arrays
  filteredInstitutions: Institution[] = [];
  filteredCoordinators: Coordinator[] = [];
  filteredParticipants: Participant[] = [];

  // Search and Filter Properties
  institutionSearch = '';
  institutionStatusFilter = 'all'; // all, active, inactive
  coordinatorSearch = '';
  coordinatorStatusFilter = 'all';
  participantSearch = '';
  participantStatusFilter = 'all';

  // Loading and Modal States
  isLoading = false;
  showMessageModal = false;
  errorMessage = '';
  successMessage = '';

  // Confirmation Modal
  showConfirmModal = false;
  confirmAction: 'activate' | 'deactivate' | null = null;
  confirmEntity: Institution | Coordinator | Participant | null = null;
  confirmEntityType: 'institution' | 'coordinator' | 'participant' | null = null;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllUsers();
  }

  loadAllUsers(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    Promise.all([
      this.loadInstitutions(),
      this.loadCoordinators(),
      this.loadParticipants()
    ]).then(() => {
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }

  loadInstitutions(): Promise<void> {
    return new Promise((resolve) => {
      this.http.get<any>('/api/users/institutions').subscribe(
        (response: any) => {
          if (response && response.success && response.data) {
            this.institutions = response.data;
            this.filterInstitutions();
          }
          resolve();
        },
        (error: any) => {
          console.error('Error loading institutions:', error);
          resolve();
        }
      );
    });
  }

  loadCoordinators(): Promise<void> {
    return new Promise((resolve) => {
      this.http.get<any>('/api/users/coordinators').subscribe(
        (response: any) => {
          if (response && response.success && response.data) {
            this.coordinators = response.data;
            this.filterCoordinators();
          }
          resolve();
        },
        (error: any) => {
          console.error('Error loading coordinators:', error);
          resolve();
        }
      );
    });
  }

  loadParticipants(): Promise<void> {
    return new Promise((resolve) => {
      this.http.get<any>('/api/users/participants').subscribe(
        (response: any) => {
          if (response && response.success && response.data) {
            this.participants = response.data;
            this.filterParticipants();
          }
          resolve();
        },
        (error: any) => {
          console.error('Error loading participants:', error);
          resolve();
        }
      );
    });
  }

  // Filtering Methods
  filterInstitutions(): void {
    this.filteredInstitutions = this.institutions.filter((institution) => {
      const matchesSearch =
        institution.institution_name.toLowerCase().includes(this.institutionSearch.toLowerCase()) ||
        institution.institution_email.toLowerCase().includes(this.institutionSearch.toLowerCase()) ||
        institution.institution_address.toLowerCase().includes(this.institutionSearch.toLowerCase());

      const matchesStatus =
        this.institutionStatusFilter === 'all' || institution.status === this.institutionStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  filterCoordinators(): void {
    this.filteredCoordinators = this.coordinators.filter((coordinator) => {
      const matchesSearch =
        coordinator.name.toLowerCase().includes(this.coordinatorSearch.toLowerCase()) ||
        coordinator.email.toLowerCase().includes(this.coordinatorSearch.toLowerCase()) ||
        coordinator.institution_name.toLowerCase().includes(this.coordinatorSearch.toLowerCase());

      const matchesStatus =
        this.coordinatorStatusFilter === 'all' || coordinator.status === this.coordinatorStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  filterParticipants(): void {
    this.filteredParticipants = this.participants.filter((participant) => {
      const matchesSearch =
        participant.participantname.toLowerCase().includes(this.participantSearch.toLowerCase()) ||
        participant.participantemail.toLowerCase().includes(this.participantSearch.toLowerCase()) ||
        participant.institution_name.toLowerCase().includes(this.participantSearch.toLowerCase());

      const matchesStatus =
        this.participantStatusFilter === 'all' || participant.status === this.participantStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  // Status Toggle Methods
  onInstitutionStatusToggle(institution: Institution): void {
    const newStatus = institution.status === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'activate' : 'deactivate';
    
    this.showConfirmModal = true;
    this.confirmAction = action as 'activate' | 'deactivate';
    this.confirmEntity = institution;
    this.confirmEntityType = 'institution';
    this.cdr.detectChanges();
  }

  onCoordinatorStatusToggle(coordinator: Coordinator): void {
    const newStatus = coordinator.status === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'activate' : 'deactivate';

    this.showConfirmModal = true;
    this.confirmAction = action as 'activate' | 'deactivate';
    this.confirmEntity = coordinator;
    this.confirmEntityType = 'coordinator';
    this.cdr.detectChanges();
  }

  onParticipantStatusToggle(participant: Participant): void {
    const newStatus = participant.status === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'activate' : 'deactivate';

    this.showConfirmModal = true;
    this.confirmAction = action as 'activate' | 'deactivate';
    this.confirmEntity = participant;
    this.confirmEntityType = 'participant';
    this.cdr.detectChanges();
  }

  confirmStatusChange(): void {
    if (!this.confirmEntity || !this.confirmEntityType || !this.confirmAction) {
      return;
    }

    const newStatus = this.confirmAction === 'activate' ? 'active' : 'inactive';
    let entityId: any;

    if (this.confirmEntityType === 'institution') {
      entityId = (this.confirmEntity as Institution).institution_id;
      this.updateInstitutionStatus(entityId, newStatus);
    } else if (this.confirmEntityType === 'coordinator') {
      entityId = (this.confirmEntity as Coordinator).coordinator_id;
      this.updateCoordinatorStatus(entityId, newStatus);
    } else if (this.confirmEntityType === 'participant') {
      entityId = (this.confirmEntity as Participant).participantid;
      this.updateParticipantStatus(entityId, newStatus);
    }

    this.closeConfirmModal();
  }

  updateInstitutionStatus(institutionId: number, status: string): void {
    this.http
      .post<any>('/api/users/update-institution-status', { institution_id: institutionId, status })
      .subscribe(
        (response: any) => {
          if (response && response.success) {
            // Update local data
            const institution = this.institutions.find((i) => i.institution_id === institutionId);
            if (institution) {
              institution.status = status;
            }
            
            // If deactivating institution, also deactivate its coordinators
            if (status === 'inactive') {
              this.coordinators = this.coordinators.map((c) => {
                if (c.institution_id === institutionId) {
                  c.status = 'inactive';
                }
                return c;
              });
            }

            this.filterInstitutions();
            this.filterCoordinators();
            this.successMessage = `Institution ${status === 'active' ? 'activated' : 'deactivated'} successfully!`;
            this.showModal();
            this.cdr.detectChanges();
          } else {
            this.errorMessage = response?.message || 'Error updating institution status';
            this.showModal();
            this.cdr.detectChanges();
          }
        },
        (error: any) => {
          this.errorMessage = error?.error?.message || 'Error updating institution status';
          this.showModal();
          this.cdr.detectChanges();
        }
      );
  }

  updateCoordinatorStatus(coordinatorId: number, status: string): void {
    this.http
      .post<any>('/api/users/update-coordinator-status', { coordinator_id: coordinatorId, status })
      .subscribe(
        (response: any) => {
          if (response && response.success) {
            const coordinator = this.coordinators.find((c) => c.coordinator_id === coordinatorId);
            if (coordinator) {
              coordinator.status = status;
            }
            this.filterCoordinators();
            this.successMessage = `Coordinator ${status === 'active' ? 'activated' : 'deactivated'} successfully!`;
            this.showModal();
            this.cdr.detectChanges();
          } else {
            this.errorMessage = response?.message || 'Error updating coordinator status';
            this.showModal();
            this.cdr.detectChanges();
          }
        },
        (error: any) => {
          this.errorMessage = error?.error?.message || 'Error updating coordinator status';
          this.showModal();
          this.cdr.detectChanges();
        }
      );
  }

  updateParticipantStatus(participantId: number, status: string): void {
    this.http
      .post<any>('/api/users/update-participant-status', { participant_id: participantId, status })
      .subscribe(
        (response: any) => {
          if (response && response.success) {
            const participant = this.participants.find((p) => p.participantid === participantId);
            if (participant) {
              participant.status = status;
            }
            this.filterParticipants();
            this.successMessage = `Participant ${status === 'active' ? 'activated' : 'deactivated'} successfully!`;
            this.showModal();
            this.cdr.detectChanges();
          } else {
            this.errorMessage = response?.message || 'Error updating participant status';
            this.showModal();
            this.cdr.detectChanges();
          }
        },
        (error: any) => {
          this.errorMessage = error?.error?.message || 'Error updating participant status';
          this.showModal();
          this.cdr.detectChanges();
        }
      );
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.confirmAction = null;
    this.confirmEntity = null;
    this.confirmEntityType = null;
    this.cdr.detectChanges();
  }

  showModal(): void {
    this.showMessageModal = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.showMessageModal = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();
  }

  switchTab(tab: 'institutions' | 'coordinators' | 'participants'): void {
    this.activeTab = tab;
  }

  clearInstitutionSearch(): void {
    this.institutionSearch = '';
    this.filterInstitutions();
  }

  clearCoordinatorSearch(): void {
    this.coordinatorSearch = '';
    this.filterCoordinators();
  }

  clearParticipantSearch(): void {
    this.participantSearch = '';
    this.filterParticipants();
  }
}
