import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { from, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private functions: Functions,
    private http: HttpClient,
    private auth: AuthService
  ) {}

  callFunction(fnName: string, data: any = {}) {
    const call = httpsCallable(this.functions, fnName);
    return call(data);
  }

  get<T>(path: string) {
    const getIdToken$ = from(this.auth.getIdToken());
    return getIdToken$.pipe(
      switchMap((token) => {
        return this.http.get<T>(`${environment.apiUrl}${path}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      })
    );
  }

  post<T>(path: string, data: any) {
    const getIdToken$ = from(this.auth.getIdToken());
    return getIdToken$.pipe(
      switchMap((token) => {
        return this.http.post<T>(`${environment.apiUrl}${path}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      })
    );
  }

  delete(path: string, param: string) {
    const getIdToken$ = from(this.auth.getIdToken());
    return getIdToken$.pipe(
      switchMap((token) => {
        return this.http.delete(`${environment.apiUrl}${path}/${param}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      })
    );
  }

  put<T>(path: string, data: any) {
    const getIdToken$ = from(this.auth.getIdToken());
    return getIdToken$.pipe(
      switchMap((token) => {
        return this.http.put<T>(`${environment.apiUrl}${path}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      })
    );
  }
}
