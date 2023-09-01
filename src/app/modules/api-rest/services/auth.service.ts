import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, Observable, map, catchError, throwError } from 'rxjs';
import { PathRest } from '../enviroments/path-rest';
import { endpoint } from '../enviroments/endpoints';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserResponse } from '../../models/userResponse';
import { UserCredentials } from '../../models/userCredentials';
import { Router } from '@angular/router';


const helper = new JwtHelperService();
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'token'; // Clave para guardar el token en el almacenamiento local
  private readonly USER_KEY = 'user'; 
  private authStatusSubject = new BehaviorSubject<boolean>(this.isSessionActive());
  authStatus$ = this.authStatusSubject.asObservable();

  constructor(private router: Router, private http: HttpClient) {}
  
  private updateAuthStatus(isAuthenticated: boolean): void {
    this.authStatusSubject.next(isAuthenticated);
  }

  login(authData: UserCredentials): Observable<boolean | void> {
    return this.http.post<UserResponse>(`${PathRest.GET_LOGIN}`, authData).pipe(
      map((response: UserResponse) => {
        if (response.success) {
          this.saveToken(response.token);
          localStorage.setItem(this.USER_KEY, response.user._id);
          this.updateAuthStatus(true);
     
        }
        return response.success;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.updateAuthStatus(false);
    this.router.navigate([endpoint.LOGIN]);
  }

  private saveToken(tokenValue: string): void {
    localStorage.setItem(this.TOKEN_KEY, tokenValue);
  }

  public isSessionActive(): boolean {
    const token = this.getToken();
    if (token && !helper.isTokenExpired(token)) {
      return true;
    }
    return false;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUserId(): string | null {
    return localStorage.getItem(this.USER_KEY);
  }



}

