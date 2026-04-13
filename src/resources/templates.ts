import { HttpClient } from '../http';
import type {
  ApiResponse,
  Template,
  TemplatePreview,
  CreateTemplateParams,
  UpdateTemplateParams,
  PaginationParams,
} from '../types';

export class Templates {
  constructor(private http: HttpClient) {}

  async create(params: CreateTemplateParams): Promise<ApiResponse<Template>> {
    return this.http.post<Template>('/templates', params);
  }

  async list(params?: PaginationParams & { domainId?: string }): Promise<ApiResponse<Template[]>> {
    return this.http.get<Template[]>('/templates', params);
  }

  async get(id: string): Promise<ApiResponse<Template>> {
    return this.http.get<Template>(`/templates/${id}`);
  }

  async update(id: string, params: UpdateTemplateParams): Promise<ApiResponse<Template>> {
    return this.http.put<Template>(`/templates/${id}`, params);
  }

  async delete(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.http.delete<{ message: string }>(`/templates/${id}`);
  }

  async preview(id: string, variables?: Record<string, string>): Promise<ApiResponse<TemplatePreview>> {
    return this.http.post<TemplatePreview>(`/templates/${id}/preview`, { variables });
  }
}
