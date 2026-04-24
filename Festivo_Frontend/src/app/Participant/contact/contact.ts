import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact-participant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class ParticipantContact {
  contactForm = {
    name: '',
    email: '',
    phone_no: '',
    subject: '',
    message: ''
  };

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  showSuccessModal = false;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  submitContact() {
    if (!this.contactForm.name || !this.contactForm.email || !this.contactForm.phone_no || !this.contactForm.subject || !this.contactForm.message) {
      this.errorMessage = 'Please fill out all fields.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.http.post('http://localhost:3000/api/contact/submit', this.contactForm).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        if (response.success) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          document.body.style.overflow = 'hidden';
          this.showSuccessModal = true;
          this.resetForm();
          this.cdr.detectChanges();
        } else {
          this.errorMessage = response.message || 'Failed to send message. Please try again.';
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = 'An error occurred. Please try again later.';
        console.error('Contact error:', error);
        this.cdr.detectChanges();
      }
    });
  }

  closeModal() {
    this.showSuccessModal = false;
    document.body.style.overflow = 'auto';
  }

  resetForm() {
    this.contactForm = {
      name: '',
      email: '',
      phone_no: '',
      subject: '',
      message: ''
    };
  }
}
