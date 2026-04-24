const fs = require('fs');
const htmlPath = 'C:/Users/shaja/OneDrive/Desktop/Santhigiri/S6/Main Project/Project/Festivo/Festivo_Frontend/src/app/Participant/mycompetitions/mycompetitions.html';
const scssPath = 'C:/Users/shaja/OneDrive/Desktop/Santhigiri/S6/Main Project/Project/Festivo/Festivo_Frontend/src/app/Participant/mycompetitions/mycompetitions.scss';

const html = `
<div class="content-wrapper fade-in-up">
  <!-- Hero Section -->
  <div class="glass-bento p-5 mb-5 bento-hero text-center position-relative overflow-hidden">
    <div class="position-relative z-1">
      <h1 class="display-4 fw-bold text-white mb-3">
        My <span class="text-neon-gradient">Competitions & Results</span>
      </h1>
      <p class="lead text-white-50 mx-auto" style="max-width: 600px;">
        Track all your events sorted by fests and celebrate your accomplishments.
      </p>
    </div>
    <!-- Decorative background elements -->
    <div class="position-absolute top-0 start-0 w-100 h-100 bg-noise opacity-10"></div>
  </div>

  <div *ngIf="isLoading" class="text-center py-5">
    <div class="spinner-border text-neon" role="status"></div>
    <p class="text-white mt-3">Loading competitions...</p>
  </div>

  <div *ngIf="errorMessage" class="alert position-bento border-0 text-white bg-danger bg-opacity-75 p-4 rounded-4 text-center">
    <i class="bi bi-exclamation-triangle fs-3 d-block mb-2"></i>
    {{ errorMessage }}
  </div>

  <div *ngIf="!isLoading && groupedFests.length === 0 && !errorMessage" class="text-center py-5">
    <div class="glass-bento p-5 d-inline-block">
      <i class="bi bi-emoji-frown text-white-50 fs-1 mb-3 d-block"></i>
      <h4 class="text-white">No Competitions Found</h4>
      <p class="text-white-50">You haven't registered for any competitions yet.</p>
      <button class="btn btn-outline-neon mt-3" routerLink="/participantmaster/viewallfests">
        Explore Fests
      </button>
    </div>
  </div>

  <div *ngIf="!isLoading && groupedFests.length > 0">
    <div class="glass-bento mb-5 p-4 bento-card-hover" *ngFor="let fest of groupedFests">
      
      <!-- Fest Header -->
      <div class="d-flex justify-content-between align-items-center border-bottom border-secondary pb-3 mb-4">
        <div>
          <h2 class="text-neon mb-1 fw-bold"><i class="bi bi-calendar-event me-2"></i>{{ fest.fest_name | uppercase }}</h2>
          <h5 class="text-white-50 mb-0">{{ fest.institution_name }}</h5>
        </div>
        <span class="badge bg-dark border border-secondary p-2 px-3 text-white fs-6">
          {{ fest.competitions.length }} Event(s)
        </span>
      </div>

      <!-- Competitions List -->
      <div class="table-responsive bento-table-wrapper rounded-3">
        <table class="table table-dark table-hover mb-0 align-middle custom-table">
          <thead>
            <tr>
              <th scope="col" class="text-neon-sm">Competition</th>
              <th scope="col" class="text-neon-sm">Date</th>
              <th scope="col" class="text-neon-sm">Type</th>
              <th scope="col" class="text-neon-sm">Result / Rank</th>
              <th scope="col" class="text-neon-sm text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let comp of fest.competitions">
              
              <td class="text-white fw-medium py-3">
                <i class="bi bi-controller me-2 text-white-50"></i>{{ comp.competition_name }}
              </td>
              
              <td class="text-white-50">{{ comp.competition_date | date:'mediumDate' }}</td>
              
              <td>
                <span class="badge" [ngClass]="comp.type === 'single' ? 'bg-primary' : 'bg-warning text-dark'">
                  {{ comp.type | uppercase }}
                </span>
              </td>
              
              <td>
                <!-- Result Logic -->
                <ng-container *ngIf="comp.res_status === 'published'; else resPending">
                  <span class="badge p-2 result-badge shadow-sm"
                        [ngClass]="{
                          'bg-success': comp.position === 'First',
                          'bg-secondary text-white': comp.position === 'Second',
                          'bg-warning text-dark': comp.position === 'Third',
                          'bg-info text-dark': !['First','Second','Third'].includes(comp.position) && comp.position
                        }">
                    <i class="bi bi-trophy-fill me-1"></i> {{ comp.position || 'Participated' }}
                  </span>
                </ng-container>
                <ng-template #resPending>
                   <span class="badge bg-dark border border-secondary text-white-50 p-2">
                     <i class="bi bi-clock me-1"></i> Pending
                   </span>
                </ng-template>
              </td>

              <td class="text-end">
                <button class="btn btn-sm btn-outline-neon px-3 py-2 fw-semibold" [routerLink]="['/participantmaster/registrationdetails', comp.competitionregid]">
                  View Details <i class="bi bi-arrow-right ms-1"></i>
                </button>
              </td>
              
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>

</div>
`;

const scss = `
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

/* Table Override Styles for Glass Bento */
.bento-table-wrapper {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;

  .custom-table {
    background-color: transparent !important;
    --bs-table-bg: transparent !important;

    thead th {
      background-color: rgba(255, 255, 255, 0.05) !important;
      border-bottom: 2px solid rgba(0, 243, 255, 0.2);
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: 0.8rem;
      padding: 1rem;
    }

    tbody tr {
      transition: all 0.3s ease;
      cursor: pointer;
      
      &:hover {
        background-color: rgba(0, 243, 255, 0.05) !important;
        td {
           background-color: transparent !important;
        }
      }

      td {
        background-color: transparent !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        padding: 1rem;
      }
    }
  }
}

.result-badge {
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

@media (max-width: 768px) {
  .content-wrapper { padding: 1rem; }
  .bento-hero { padding: 2rem !important; }
}
`;

fs.writeFileSync(htmlPath, html);
fs.writeFileSync(scssPath, scss);
console.log('HTML and SCSS Files Written!');
