import { HttpClient } from '../http';
import type {
  ApiResponse,
  SendSingleParams,
  SendBatchParams,
  SendResult,
  BatchSendResult,
  JobStatus,
} from '../types';

export class Send {
  constructor(private http: HttpClient) {}

  async single(params: SendSingleParams): Promise<ApiResponse<SendResult>> {
    return this.http.post<SendResult>('/send/single', params);
  }

  async batch(params: SendBatchParams): Promise<ApiResponse<BatchSendResult>> {
    return this.http.post<BatchSendResult>('/send/batch', params);
  }

  async getJobStatus(jobId: string): Promise<ApiResponse<JobStatus>> {
    return this.http.get<JobStatus>(`/send/${jobId}/status`);
  }

  async cancel(jobId: string): Promise<ApiResponse<{ message: string }>> {
    return this.http.delete<{ message: string }>(`/send/${jobId}`);
  }
}
