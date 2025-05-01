import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatchResult, ResumeDto } from '../models/matcher.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MatcherService {
  private apiUrl = 'https://localhost:7093/api';

  constructor(private http: HttpClient) { }

  matchCvWithJob(
    cvFile: File | null,
    jobDescriptionFile: File | null,
    cvText: string = '',
    jobDescription: string = '',
    template: string = 'classic'
  ): Observable<ResumeDto> {
    const formData = new FormData();
    formData.append('CvPdfFile', cvFile || '');
    formData.append('JobDescriptionPdfFile', jobDescriptionFile || '');
    formData.append('CvText', cvText);
    formData.append('JobDescription', jobDescription);
    formData.append('Template', template);

    const headers = new HttpHeaders({
      'accept': 'text/plain'
    });

    return this.http.post<ResumeDto>(`${this.apiUrl}/BuildCv`, formData, { 
      headers
    });
  }

  downloadPdf(pdfPath: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download-cv/`, {
      params: new HttpParams().set('pdf_path', pdfPath),
      responseType: 'blob'
    });
  }
}