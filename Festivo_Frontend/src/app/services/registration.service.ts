import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  registerParticipant(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/registration/register-participant`, formData);
  }

  registerInstitution(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/institution-registration/register-institution`, formData);
  }

  checkUsernameAvailability(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/registration/check-username/${username}`);
  }

  checkEmailAvailability(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/registration/check-email/${email}`);
  }

  checkInstitutionEmailAvailability(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/institution-registration/check-email/${email}`);
  }

  sendOTP(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/otp/send-otp`, { email });
  }

  verifyOTP(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/otp/verify-otp`, { email, otp });
  }

  searchLocation(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/institution-registration/search-location?query=${encodeURIComponent(query)}`);
  }
}
