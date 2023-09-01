import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { PathRest } from 'src/app/modules/api-rest/enviroments/path-rest';
import { ApiResponse } from 'src/app/modules/models/apiResponse';
import { User } from 'src/app/modules/models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<ApiResponse>(PathRest.GET_USERS).pipe(
      map((response) => response.data),
      catchError(() => of([]))
    );
  }


  getUserById(id: string): Observable<User | null> {
    return this.http.get<ApiResponse>(`${PathRest.GET_USERS}/${id}`).pipe(
      map((response) => response.data),
      catchError(() => of(null))
    );
  }

  getMembersNames(memberIds: string[]): Observable<string[]> {
    const membersNames$: Observable<string>[] = memberIds.map(memberId =>
      this.getUserById(memberId).pipe(
        map(user => user ? `${user.name.first} ${user.name.last}` : ''),
        catchError(() => of(''))
      )
    );
    return forkJoin(membersNames$);
  }

  getUsersByIds(ids: string[]): Observable<User[]> {
    const userObservables$: Observable<User | null>[] = ids.map(id =>
      this.getUserById(id).pipe(
        catchError(() => of(null))
      )
    );

    return forkJoin(userObservables$).pipe(
      map(users => users.filter(user => user !== null) as User[])
    );
  }

}
