import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { ParamsObject } from 'types/api-schema';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  private withDefaultHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store',
      Pragma: 'no-cache',
    };
  }

  get<T>(path: string, params?: HttpParams | ParamsObject): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${path}`, {
      headers: this.withDefaultHeaders(),
      params,
    });
  }

  post<T>(path: string, body?: FormData): Observable<T>;
  post<T>(path: string, body?: Object): Observable<T>;
  post<T>(path: string, body: FormData | Object = {}): Observable<T> {
    let httpOptions = {};

    if (!(body instanceof FormData)) {
      httpOptions = {
        headers: this.withDefaultHeaders(),
      };
    }

    return this.http.post<T>(`${this.baseUrl}${path}`, body, httpOptions);
  }

  patch<T>(path: string, body: Object = {}): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${path}`, body, {
      headers: this.withDefaultHeaders(),
    });
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${path}`, {
      headers: this.withDefaultHeaders(),
    });
  }
}
