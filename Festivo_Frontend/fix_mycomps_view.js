const fs = require('fs');
const htmlPath = 'C:/Users/shaja/OneDrive/Desktop/Santhigiri/S6/Main Project/Project/Festivo/Festivo_Frontend/src/app/Participant/mycompetitions/mycompetitions.html';

const htmlContent = `
<div class="content-wrapper fade-in-up">
  <!-- Dynamic Hero Header -->
  <div class="glass-bento p-5 mb-5 bento-hero text-center position-relative overflow-hidden">
    <div class="position-relative z-1">
      <h1 class="display-4 fw-bold text-white mb-3" *ngIf="!selectedFest">
        My <span class="text-neon-gradient">Registered Fests</span>
      </h1>
      <h1 class="display-4 fw-bold text-white mb-3" *ngIf="selectedFest">
        <span class="text-neon-gradient">{{ selectedFest?.fest_name }}</span>
      </h1>
      <p class="lead text-white-50 mx-auto" style="max-width: 600px;" *ngIf="!selectedFest">
        Select a fest below to view your registered competitions and results.
      </p>
      <p class="lead text-white-50 mx-auto" style="max-width: 600px;" *ngIf="selectedFest">
        {{ selectedFest?.institution_name }}
      </p>
    </div>
    <div class="position-absolute top-0 start-0 w-100 h-100 bg-noise opacity-10"></div>
  </div>

  <div *ngIf="isLoading" class="text-center py-5">
    <div class="spinner-border text-neon" role="status"></div>
    <p class="text-white mt-3">Loading your logs...</p>
  </div>

  <div *ngIf="errorMessage" class="alert position-bento border-0 text-white bg-danger bg-opacity-75 p-4 rounded-4 text-center">
    <i class="bi bi-exclamation-triangle fs-3 d-block mb-2"></i>
    {{ errorMessage }}
  </div>

  <div *ngIf="!isLoading && groupedFests.length === 0 && !errorMessage" class="text-center py-5">
    <div class="glass-bento p-5 d-inline-block">
      <i class="bi bi-emoji-frown text-white-50 fs-1 mb-3 d-block"></i>
      <h4 class="text-white">No Participations Found</h4>
      <p class="text-white-50">It looks like you haven't registered for any events yet!</p>
      <button class="btn btn-outline-neon mt-3" routerLink="/participantmaster/viewallfests">
        Find a Fest
      </button>
    </div>
  </div>

  <!-- VIEW 1: FEST CARDS GRID -->
  <div *ngIf="!isLoading && groupedFests.length > 0 && !selectedFest">
    <div class="row g-4">
      <div class="col-md-6 col-lg-4" *ngFor="let fest of groupedFests">
        <div class="glass-bento h-100 p-0 bento-card-hover overflow-hidden d-flex flex-column pointer-cursor" (click)="selectFest(fest)">
          <div class="position-relative">
            <img [src]="getFestImage(fest.fest_image)" class="w-100 object-fit-cover mask-img" alt="Fest Poster" style="height: 220px;" onerror="this.src='/assets/images/default.jpg'"/>
            <div class="position-absolute top-0 end-0 m-3">
               <span class="badge bg-dark border border-secondary text-white shadow-sm p-2">
                 {{ fest.competitions.length }} Competition(s)
               </span>
            </div>
            <!-- Gradient Overlay -->
            <div class="position-absolute bottom-0 start-0 w-100 h-50" style="background: linear-gradient(to top, rgba(15, 23, 42, 1), transparent);"></div>
          </div>
          
          <div class="p-4 flex-grow-1 d-flex flex-column justify-content-end position-relative" style="margin-top: -40px;">
            <h3 class="text-neon fw-bold mb-1">{{ fest.fest_name }}</h3>
            <p class="text-white-50 mb-3 small"><i class="bi bi-building me-2"></i>{{ fest.institution_name }}</p>
            <button class="btn btn-outline-neon mt-auto w-100">View Results <i class="bi bi-arrow-right ms-2"></i></button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- VIEW 2: SELECTED FEST COMPETITIONS -->
  <div *ngIf="selectedFest">
    <div class="mb-4">
      <button class="btn btn-sm btn-outline-secondary text-white" (click)="goBack()">
        <i class="bi bi-arrow-left me-2"></i> Back to Fests
      </button>
    </div>

    <!-- Competitions List Cards -->
    <div class="row g-4">
       <div class="col-lg-6" *ngFor="let comp of selectedFest.competitions">
          <div class="glass-bento p-4 h-100 bento-card-hover position-relative overflow-hidden result-glow shadow"
              [ngClass]="{
                  'glow-success': comp.position === 'First',
                  'glow-secondary': comp.position === 'Second',
                  'glow-warning': comp.position === 'Third'
              }">
              
              <div class="d-flex justify-content-between align-items-start mb-3 border-bottom border-secondary pb-3">
                 <div>
                    <h4 class="text-white fw-bold mb-1">{{ comp.competition_name }}</h4>
                    <span class="badge" [ngClass]="comp.type === 'single' ? 'bg-primary' : 'bg-warning text-dark'">
                      {{ comp.type | uppercase }} EVENT
                    </span>
                 </div>
                 <div class="text-end">
                    <span class="text-white-50 small d-block">{{ comp.competition_date | date:'mediumDate' }}</span>
                 </div>
              </div>

              <!-- Main Result Bar inside the card -->
              <div class="p-3 rounded-3 mt-3 d-flex justify-content-between align-items-center" style="background: rgba(0,0,0,0.4);">
                  <div class="d-flex align-items-center">
                    <span class="text-white-50 me-3">Result:</span>
                    
                    <ng-container *ngIf="comp.res_status === 'published'; else resPending">
                      <span class="badge p-2 fs-6 shadow-sm"
                            [ngClass]="{
                              'bg-success': comp.position === 'First',
                              'bg-secondary text-white': comp.position === 'Second',
                              'bg-warning text-dark': comp.position === 'Third',
                              'bg-info text-dark': !['First','Second','Third'].includes(comp.position) && comp.position
                            }">
                        <i class="bi bi-trophy-fill me-2"></i> {{ comp.position || 'Participated' }}
                      </span>
                    </ng-container>
                    
                    <ng-template #resPending>
                       <span class="badge bg-dark border border-secondary text-white-50 p-2 fs-6">
                         <i class="bi bi-clock me-2"></i> Pending
                       </span>
                    </ng-template>
                  </div>

                  <button class="btn btn-sm btn-outline-neon" [routerLink]="['/participantmaster/registrationdetails', comp.competitionregid]">
                    Details <i class="bi bi-chevron-right ms-1"></i>
                  </button>
              </div>

          </div>
       </div>
    </div>
  </div>

</div>
`;

const scssPath = 'C:/Users/shaja/OneDrive/Desktop/Santhigiri/S6/Main Project/Project/Festivo/Festivo_Frontend/src/app/Participant/mycompetitions/mycompetitions.scss';

const scssContent = `
@import '../../../styles.scss';

.content-wrapper {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.bento-hero {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9)), url('/assets/images/bento-bg.svg') no-repeat center center;
  background-size: cover;
  border-radius: 24px;
}

.text-neon-gradient {
  background: linear-gradient(90deg, #00f3ff, #00ff88);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(0,243,255,0.4);
}

.pointer-cursor {
  cursor: pointer;
}

.mask-img {
  mask-image: linear-gradient(to top, transparent 0%, black 50%);
  -webkit-mask-image: linear-gradient(to top, transparent 0%, black 50%);
}

.result-glow {
  transition: all 0.3s ease;
  border-left: 2px solid transparent;
}

.glow-success {
  border-left: 4px solid #198754 !important;
  background: linear-gradient(90deg, rgba(25, 135, 84, 0.05), rgba(15, 23, 42, 0.6)) !important;
}

.glow-secondary {
  border-left: 4px solid #6c757d !important;
  background: linear-gradient(90deg, rgba(108, 117, 125, 0.05), rgba(15, 23, 42, 0.6)) !important;
}

.glow-warning {
  border-left: 4px solid #ffc107 !important;
  background: linear-gradient(90deg, rgba(255, 193, 7, 0.05), rgba(15, 23, 42, 0.6)) !important;
}
`;

fs.writeFileSync(htmlPath, htmlContent);
fs.writeFileSync(scssPath, scssContent);
console.log('HTML AND SCSS Restructured to strictly use Dual-ViewState Cards!');
