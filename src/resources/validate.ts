import { HttpClient } from '../http';
import type { ApiResponse, ValidationResult } from '../types';

export class Validate {
  constructor(private http: HttpClient) {}

  async email(email: string): Promise<ApiResponse<ValidationResult>> {
    return this.http.post<ValidationResult>('/validate/email', { email });
  }

  async batch(emails: string[]): Promise<ApiResponse<ValidationResult[]>> {
    return this.http.post<ValidationResult[]>('/validate/batch', { emails });
  }
}
