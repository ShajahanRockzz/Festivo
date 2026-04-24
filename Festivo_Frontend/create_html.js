const fs = require('fs');

const htmlContent = \
<div class="registration-container">
  <div class="registration-wrapper">
    <div class="registration-header">
      <h1>Register for {{ competitionDetails?.competition_name || 'Competition' }}</h1>
      <p *ngIf="competitionDetails">Join the contest! Registration Fee: Rs {{ competitionDetails?.reg_fee }}</p>
    </div>

    <div class="registration-content">
      <div *ngIf="isLoading" style="text-align: center; padding: 2rem;">
        <i class="fas fa-spinner fa-spin fa-2x"></i>
        <p>Loading details...</p>
      </div>

      <form *ngIf="!isLoading && competitionDetails" (ngSubmit)="submitRegistration()" #registrationForm="ngForm">
        <div class="form-section">
          <h2 class="section-title">Registration Details</h2>

          <!-- Show individual or group setup based on competition type -->
          <div class="form-group" *ngIf="competitionDetails.type === 'individual'">
            <p><strong>Type:</strong> Individual Competition</p>
            <p style="color: #666; font-size: 0.9em; margin-bottom: 1rem;">
              You will be registered under your profile name: {{ currentUser?.participantname }}.
            </p>
          </div>

          <div *ngIf="competitionDetails.type === 'group'" class="form-group">
            <p><strong>Type:</strong> Group Competition</p>
            <p style="color: #666; font-size: 0.9em; margin-bottom: 1rem;">
              Members Required: {{ competitionDetails.min_members }} to {{ competitionDetails.max_members }}
            </p>

            <div class="form-group">
               <label for="groupName">Group / Team Name *</label>
               <input
                 type="text"
                 id="groupName"
                 [(ngModel)]="registrationFormModel.groupName"
                 name="groupName"
                 class="form-control"
                 placeholder="Enter your team name"
                 required
               />
            </div>
            
            <div class="form-group">
               <label>Group Members (including yourself) *</label>
               <textarea
                 id="groupMembers"
                 [(ngModel)]="registrationFormModel.groupMembers"
                 name="groupMembers"
                 class="form-control"
                 placeholder="List member names and emails..."
                 rows="4"
                 required
               ></textarea>
            </div>
          </div>
          
          <div class="form-group">
            <label for="notes">Any Additional Notes / Requirements</label>
            <textarea
              id="notes"
              [(ngModel)]="registrationFormModel.notes"
              name="notes"
              class="form-control"
              placeholder="Any special requests or details..."
              rows="3"
            ></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-cancel" (click)="goBack()">Cancel</button>
          <button type="submit" class="btn-submit" [disabled]="!registrationForm.form.valid || isSubmitting">
            <span *ngIf="isSubmitting"><i class="fas fa-spinner fa-spin"></i> Processing...</span>
            <span *ngIf="!isSubmitting">Confirm Registration</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
\;

fs.writeFileSync('src/app/Participant/registercompetition/registercompetition.html', htmlContent, 'utf8');
