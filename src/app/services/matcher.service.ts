import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatchResult } from '../models/matcher.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MatcherService {
  private apiUrl = 'http://localhost:8001';

  constructor(private http: HttpClient) { }

  matchCvWithJob(cv: string, jobDescription: string, template: string = 'classic'): Observable<MatchResult> {
    const headers = new HttpHeaders({
      'accept': 'application/json'
    });

    const params = new HttpParams()
      .set('cv', cv)
      .set('job_description', jobDescription)
      .set('template', template);
    
    return this.http.post<MatchResult>(`${this.apiUrl}/build-cv/`, null, { 
      headers,
      params 
    });
  }

  downloadPdf(pdfPath: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download-cv/`, {
      params: new HttpParams().set('pdf_path', pdfPath),
      responseType: 'blob'
    });
  }
}