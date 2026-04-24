const fs = require('fs');
const htmlPath = 'C:/Users/shaja/OneDrive/Desktop/Santhigiri/S6/Main Project/Project/Festivo/Festivo_Frontend/src/app/Participant/registrationdetails/registrationdetails.html';

const html = `
<div class="content-wrapper">

  <div *ngIf="isLoading" class="glass-bento mt-5 p-5 text-center">
    <div class="spinner-border text-neon" role="status"></div>
    <p class="mt-3 text-white">Loading Registration Details...</p>
  </div>

  <div *ngIf="error" class="glass-bento error-state mt-5 p-5 text-center">
    <i class="bi bi-exclamation-triangle-fill text-danger fs-1"></i>
    <h3 class="text-white mt-3">{{ error }}</h3>
    <button class="btn btn-outline-neon mt-3" routerLink="/participantmaster/myregistrations">
      Back to Registrations
    </button>
  </div>

  <div *ngIf="registration && !isLoading && !error" class="container mt-5 mb-5 fade-in-up">
    
    <!-- Hero Banner for Registration details -->
    <div class="bento-hero-ticket p-4 mb-4">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h1 class="text-neon mb-1 fw-bold">{{ registration.competition_name | uppercase }}</h1>
          <h5 class="text-white-50">{{ registration.fest_name }}</h5>
        </div>
        <div class="text-end">
          <span class="badge" [ngClass]="registration.type === 'single' ? 'bg-primary' : 'bg-warning text-dark'">
            {{ registration.type | uppercase }} EVENT
          </span>
          <p class="text-white mt-2 mb-0"><strong>ID:</strong> {{ registration.reg_id }}</p>
        </div>
      </div>
    </div>

    <!-- Top 3 Cards Row -->
    <div class="row g-4 mb-4">
      <!-- Left Column: Core Info -->
      <div class="col-lg-4">
        <div class="glass-bento p-4 h-100 bento-card-hover intel-card">
          <h4 class="text-white mb-4 border-bottom border-light pb-2">Event Intel</h4>
          
          <div class="info-group mb-4">
            <span class="text-neon-sm d-block">Institution</span>
            <span class="text-white fw-bold">{{ registration.institution_name || 'N/A' }}</span>
          </div>

          <div class="info-group mb-4">
            <span class="text-neon-sm d-block">Scheduled Date</span>
            <span class="text-white fw-bold">{{ registration.competition_date | date: 'mediumDate' }}</span>
          </div>

          <div class="info-group mb-4">
            <span class="text-neon-sm d-block">Registered On</span>
            <span class="text-white">{{ registration.regdate | date: 'mediumDate' }}</span>
          </div>

        </div>
      </div>

      <!-- Center Column: Attendance -->
      <div class="col-lg-4">
        <div class="glass-bento p-4 h-100 bento-card-hover attendance-card">
          <h4 class="text-white mb-3 border-bottom border-light pb-2">Attendance</h4>
          <div class="attendance-badge d-inline-flex p-2 px-3 align-items-center rounded-3 fs-5 fw-bold mt-2" [ngClass]="getAttendanceDisplay(registration.competition_date, registration.attendance).cssClass">
              <i class="bi bi-person-check-fill me-2" *ngIf="getAttendanceDisplay(registration.competition_date, registration.attendance).text === 'Present'"></i>
              <i class="bi bi-hourglass-split me-2" *ngIf="getAttendanceDisplay(registration.competition_date, registration.attendance).text === 'Pending'"></i>
              <i class="bi bi-person-x-fill me-2" *ngIf="getAttendanceDisplay(registration.competition_date, registration.attendance).text === 'Absent'"></i>
              {{ getAttendanceDisplay(registration.competition_date, registration.attendance).text }}
          </div>
        </div>
      </div>

      <!-- Right Column: Results -->
      <div class="col-lg-4">
        <div class="glass-bento p-4 h-100 bento-card-hover results-card">
          <h4 class="text-white mb-3 border-bottom border-light pb-2">Results</h4>
          <div *ngIf="registration.res_status === 'published'; else resPending" class="alert position-bento border-0 text-white p-3 rounded-3 mt-2" 
              [ngClass]="{'bg-success bg-gradient': registration.position === 'First',
                          'bg-secondary bg-gradient': registration.position === 'Second',
                          'bg-warning text-dark bg-gradient': registration.position === 'Third',
                          'bg-info text-dark bg-gradient': !['First','Second','Third'].includes(registration.position)}">
            <strong><i class="bi bi-trophy-fill me-2"></i> Rank: </strong> {{ registration.position || 'Published - View Results' }}
          </div>
          <ng-template #resPending>
             <div class="alert bg-dark border border-secondary text-white-50 p-3 rounded-3 mt-2">
               <i class="bi bi-clock me-2"></i> Results Pending
             </div>
          </ng-template>
        </div>
      </div>
    </div>

    <!-- Centered Rules & Guidelines -->
    <div class="row mb-5">
      <div class="col-12">
        <div class="glass-bento p-4 bento-card-hover rules-card">
          <h4 class="text-white mb-3 border-bottom border-light pb-2 text-center"><i class="bi bi-book me-2"></i>Rules & Guidelines</h4>
          <div class="rules-box p-3 rounded text-white-50 bg-dark bg-opacity-50 text-center" style="max-height: 200px; overflow-y: auto;">
            {{ registration.rules || 'No specific rules provided for this event.' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Group Members Section (Only shown if type is 'group') -->
    <div class="row mt-4" *ngIf="registration.type === 'group' && registration.group_members?.length > 0">
       <div class="col-12">
          <h3 class="text-neon mb-4"><i class="bi bi-people-fill me-2"></i>Squad Roster</h3>
          <div class="row g-3">
             <div class="col-md-6 col-lg-4" *ngFor="let member of registration.group_members">
                <div class="glass-bento p-3 h-100 squad-card hover-glow transition-all">
                   <h5 class="text-white border-bottom border-light pb-2 mb-3">
                      <i class="bi bi-person me-2 text-neon"></i> {{ member.participantname | titlecase }}
                   </h5>
                   <p class="mb-1 text-white-50"><i class="bi bi-envelope me-2"></i> {{ member.email }}</p>
                   <p class="mb-1 text-white-50"><i class="bi bi-telephone me-2"></i> {{ member.contact_no }}</p>
                   <p class="mb-0 text-white-50"><i class="bi bi-card-text me-2"></i> ID Proof: {{ member.collegeidproof }}</p>
                </div>
             </div>
          </div>
       </div>
    </div>

  </div>
</div>
`;

fs.writeFileSync(htmlPath, html.trim());
console.log('Layout explicitly redefined across col-lg-4 containers!');
