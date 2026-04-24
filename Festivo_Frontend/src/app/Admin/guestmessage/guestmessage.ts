import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Message {
  contact_id: number;
  name: string;
  email: string;
  phone_no: string;
  subject: string;
  message: string;
  status: string;
}

@Component({
  selector: 'app-guestmessage',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './guestmessage.html',
  styleUrl: './guestmessage.scss',
})
export class Guestmessage implements OnInit {
  messages: Message[] = [];
  filterStatus: 'all' | 'readed' | 'unreaded' = 'all';
  isLoading = true;
  errorMessage = '';
  showDeleteConfirm = false;
  messageToDeleteId: number | null = null;
  apiUrl = 'http://localhost:3000/api/contact/messages'; // Needs to match how app.js maps contact

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchMessages();
  }

  get filteredMessages(): Message[] {
    if (this.filterStatus === 'all') {
      return this.messages;
    }
    return this.messages.filter(msg => msg.status === this.filterStatus);
  }

  getUnreadCount(): number {
    return this.messages.filter(msg => msg.status === 'unreaded').length;
  }

  getReadCount(): number {
    return this.messages.filter(msg => msg.status === 'readed').length;
  }

  setFilter(status: 'all' | 'readed' | 'unreaded'): void {
    this.filterStatus = status;
    this.cdr.detectChanges();
  }

  fetchMessages(): void {
    this.isLoading = true;
    this.http.get<{success: boolean, messages: Message[]}>(this.apiUrl).subscribe({
      next: (res) => {
        if (res.success) {
          this.messages = res.messages;
        } else {
          this.errorMessage = 'Failed to load messages';
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching messages', err);
        this.errorMessage = 'An error occurred while fetching messages';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  markAsRead(id: number): void {
    const url = `${this.apiUrl}/${id}/read`;
    this.http.put<{success: boolean}>(url, {}).subscribe({
      next: (res) => {
        if (res.success) {
          const msg = this.messages.find(m => m.contact_id === id);
          if (msg) {
             msg.status = 'readed';
             this.messages = [...this.messages]; // Reassign array reference to trigger change detection
          }
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error updating status', err);
        alert('Failed to mark as read');
      }
    });
  }

  deleteMessage(id: number): void {
    this.messageToDeleteId = id;
    this.showDeleteConfirm = true;
    this.cdr.detectChanges();
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.messageToDeleteId = null;
    this.cdr.detectChanges();
  }

  confirmDeleteAction(): void {
    if (!this.messageToDeleteId) return;
    
    const id = this.messageToDeleteId;
    const url = `${this.apiUrl}/${id}`;
    
    this.http.delete<{success: boolean}>(url).subscribe({
      next: (res) => {
        if (res.success) {
          // Properly replace the array to trigger change detection for computed getters
          this.messages = [...this.messages.filter(m => m.contact_id !== id)];
          this.showDeleteConfirm = false;
          this.messageToDeleteId = null;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error deleting message', err);
        alert('Failed to delete message');
        this.showDeleteConfirm = false;
        this.messageToDeleteId = null;
        this.cdr.detectChanges();
      }
    });
  }
}
