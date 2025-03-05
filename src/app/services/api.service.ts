import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { environment } from '/home/well/dev/wisetruckv2/wisetruck-frontend/src/environments/environment';
import { environment } from '/home/well/dev/wisetruckv2/wisetruck-frontend/src/environments/environment';
import { Observable } from 'rxjs';
import { Caminhao } from '../models/caminhao.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getData(endpoint: string) {
    return this.http.get(`${this.baseUrl}/${endpoint}`);
  }

  postData(endpoint: string, data: any) {
    return this.http.post(`${this.baseUrl}/${endpoint}`, data);
  }

  getTestData(): Observable<Caminhao[]> {
    return this.http.get<Caminhao[]>(`${this.baseUrl}/api/Caminhao`);
  }
}

