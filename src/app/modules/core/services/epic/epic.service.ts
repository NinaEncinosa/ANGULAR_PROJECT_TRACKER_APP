import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators'
import { Epic } from 'src/app/modules/models/epic.model';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from 'src/app/modules/models/apiResponse';
import { Story } from 'src/app/modules/models/story';
import { PathRest } from 'src/app/modules/api-rest/enviroments/path-rest';
import { endpoint } from 'src/app/modules/api-rest/enviroments/endpoints';
import { ListService } from '../list/list.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EpicFormComponent } from 'src/app/modules/presentation/feature/forms/epic-form/epic-form.component';

@Injectable({
  providedIn: 'root'
})
export class EpicService extends ListService<Epic>{

  private epicsSubject = new BehaviorSubject<Epic[]>([]);
  epics$ = this.epicsSubject.asObservable();

  constructor(
    private http:HttpClient,
    private snackBar: MatSnackBar,
    private dialog: MatDialog  
  ) { 
    super();
  }

  //abstract methods
  override getAllItems(): Observable<Epic[]> {
    this.http
      .get<ApiResponse>(PathRest.GET_EPICS)
      .pipe(map((response) => response.data),
      catchError(() => of([]))
      ).subscribe({
        next: (epics) => {
          epics.sort((a: any, b: any) => b._id.localeCompare(a._id));
          if (this.epicsSubject)
          this.epicsSubject.next(epics);
        }
      });
    return this.epics$;
  }

  override getItems(id: string): Observable<Epic[]> {
    this.http
      .get<ApiResponse>(`${PathRest.GET_PROJECTS}/${id}${endpoint.EPICS}`)
      .pipe(
        map((response) => response.data),
        catchError(() => of([])
      )
    ).subscribe({
      next: (epics) => {
        epics.sort((a: any, b: any) => b._id.localeCompare(a._id));
        if (this.epicsSubject) {
          this.epicsSubject.next(epics);
        }
      }
    });
    return this.epics$;
  }

  override getItemById(id: string): Observable<Epic> {
    return this.http.get<ApiResponse>(`${PathRest.GET_EPICS}/${id}`).pipe(
      map(response => response.data)
    );
  }

  override getItemName(id: string): Observable<string> {
    return this.getItemById(id).pipe(
      map((epic: Epic) => epic.name)
    );
  }

  override createItem(item: Epic): Observable<Epic> {
    return this.http
    .post<ApiResponse>(PathRest.GET_EPICS, item)
    .pipe(map((response) => response.data));
  }

  override editItem(epic: Epic): void {
    const dialogRef = this.dialog.open(EpicFormComponent, {
      data: { initialValues: epic },
    });

    dialogRef.componentInstance.toggleIsEditing();
  }

  override updateItem(item: Epic): Observable<Epic | null> {
    return this.http
      .put<ApiResponse>(`${PathRest.GET_EPICS}/${item._id}`, item)
      .pipe(
        map((response) => response.data),
        catchError(() => of(null))
    );
  }
  
  override deleteItem(id: string): Observable<Epic | null> {
    return this.getStoriesByEpic(id).pipe(
      switchMap(stories => {
        if (stories.length > 0) {
          this.snackBar.open('This epic has associated stories and cannot be deleted.', 'Close', {
            duration: 5000,
          });
          return of(null); 
        } else {
          return this.http.delete<ApiResponse>(`${PathRest.GET_EPICS}/${id}`)
            .pipe(
              map((response) => response.data),
              catchError(error => {
                return of(null);
              }),
              tap(() => {
                this.snackBar.open('Epic deleted successfully.', 'Close', {
                  duration: 5000,
                });
              })
            );
        }
      })
    );
  }

  //se necesita para el delete para saber si tiene stories asociadas
  getStoriesByEpic(id: string): Observable<Story[]> {
    return this.http.get<ApiResponse>(`${PathRest.GET_EPICS}/${id}${endpoint.STORIES}`).pipe(
      map(response => response.data),
      catchError(() => of([])) 
    );
  }

  getStoriesIds(id: string): Observable<string[]> {
    return this.getStoriesByEpic(id).pipe(
      map(stories => stories.map(story => story._id))
    );
  }  

}
