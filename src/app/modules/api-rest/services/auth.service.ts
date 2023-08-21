import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map, catchError, throwError } from 'rxjs';
import { User } from '../../models/user';
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
  private loggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();
  private currentUser : User | null = null;
  constructor(private router: Router ,private http: HttpClient) {}



  ngOnInit(){
    this.loggedIn$ = this.loggedInSubject.asObservable();
  }
  login(authData: UserCredentials): Observable<boolean |void> {
    return this.http.post<UserResponse>(`${PathRest.GET_LOGIN}`, authData)
    .pipe(
      map((response: UserResponse) => {
        if(response.success){
          this.saveToken(response.token);
          this.currentUser = response.user;
          this.loggedInSubject.next(true);
        }
        return response.success;
      }),catchError((error: HttpErrorResponse) => {
        return throwError(()=> error);
      }
  
    ))
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.loggedInSubject.next(false);
    this.router.navigate([endpoint.LOGIN]);
  }

  public checkToken(): void {
    const token = this.getToken()!;
    const isExpired = helper.isTokenExpired(token);
    isExpired ? this.logout() : this.loggedInSubject.next(true);
  }

  private saveToken(tokenValue: string): void {
    localStorage.setItem(this.TOKEN_KEY, tokenValue);
  }

  get isLoggedIn(): Observable<boolean> {
    console.log('observable en is LoggedIn', this.loggedInSubject.asObservable())
    return this.loggedInSubject.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  get user(): User | null {
    return this.currentUser ? this.currentUser : null;
  }
}
