import { Injectable } from '@angular/core';
import { ListService } from '../list/list.service';
import { Project } from 'src/app/modules/models/project.model';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { ApiResponse } from 'src/app/modules/models/apiResponse';
import { HttpClient } from '@angular/common/http';
import { Epic } from 'src/app/modules/models/epic.model';
import { PathRest } from 'src/app/modules/api-rest/enviroments/path-rest';
import { endpoint } from 'src/app/modules/api-rest/enviroments/endpoints';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectFormComponent } from 'src/app/modules/presentation/feature/forms/project-form/project-form.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class ProjectService extends ListService<Project> {
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  projects$ = this.projectsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    super();
  }

  //abstract methods
  override getAllItems(): Observable<Project[]> {
    this.http
      .get<ApiResponse>(PathRest.GET_PROJECTS)
      .pipe(
        map((response) => response.data),
        catchError(() => of([]))
      )
      .subscribe({
        next: (projects) => {
          projects.sort((a: any, b: any) => b._id.localeCompare(a._id));
          if (this.projectsSubject) this.projectsSubject.next(projects);
        },
      });
    return this.projects$;
  }

  override getItems(id: string): Observable<Project[]> {
    this.http
      .get<ApiResponse>(`${PathRest.GET_PROJECTS}`)
      .pipe(
        map((response) => response.data),
        catchError(() => of([]))
      )
      .subscribe({
        next: (projects) => {
          projects.sort((a: any, b: any) => b._id.localeCompare(a._id));
          if (this.projectsSubject) this.projectsSubject.next(projects);
        },
      });
    return this.projects$;
  }

  override getItemById(id: string): Observable<Project> {
    return this.http
      .get<ApiResponse>(`${PathRest.GET_PROJECTS}/${id}`)
      .pipe(map((response) => response.data));
  }

  override getItemName(id: string): Observable<string> {
    return this.getItemById(id).pipe(map((project: Project) => project.name));
  }

  override createItem(item: Project): Observable<Project> {
    return this.http
      .post<ApiResponse>(PathRest.GET_PROJECTS, item)
      .pipe(map((response) => response.data));
  }

  override editItem(project: Project): void {
    const dialogRef = this.dialog.open(ProjectFormComponent, {
      data: { initialValues: project },
    });

    dialogRef.componentInstance.toggleIsEditing();
  }

  override updateItem(item: Project): Observable<Project | null> {
    return this.http
      .put<ApiResponse>(`${PathRest.GET_PROJECTS}/${item._id}`, item)
      .pipe(
        map((response) => response.data),
        catchError(() => of(null))
      );
  }

  override deleteItem(id: string): Observable<Project | null> {
    return this.getEpicsByProject(id).pipe(
      switchMap((epics) => {
        if (epics.length > 0) {
          this.snackBar.open(
            'This project has associated epics and cannot be deleted.', 'Close', {
              duration: 5000,
            });
          return of(null);
        } else {
          return this.http
            .delete<ApiResponse>(`${PathRest.GET_PROJECTS}/${id}`)
            .pipe(
              map((response) => response.data),
              catchError((error) => {
                return of(null);
              }),
              tap(() => {
                this.snackBar.open('Project deleted successfully.', 'Close', {
                  duration: 5000,
                });
              })
            );
        }
      })
    );
  }

  //se usa para que el detele sepa si hay epics asociados
  getEpicsByProject(id: string): Observable<Epic[]> {
    return this.http
      .get<ApiResponse>(`${PathRest.GET_PROJECTS}/${id}${endpoint.EPICS}`)
      .pipe(
        map((response) => response.data),
        catchError(() => of([]))
      );
  }

  getEpicsIds(id: string): Observable<string[]> {
    return this.getEpicsByProject(id).pipe(
      map(epics => epics.map(epic => epic._id))
    );
  }  

}
