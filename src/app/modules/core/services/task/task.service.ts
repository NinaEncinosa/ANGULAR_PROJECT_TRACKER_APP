import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { Task } from 'src/app/modules/models/task.model';
import { ListService } from '../list/list.service';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from 'src/app/modules/models/apiResponse';
import { PathRest } from 'src/app/modules/api-rest/enviroments/path-rest';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskFormComponent } from 'src/app/modules/presentation/feature/forms/task-form/task-form.component';
import { MatDialog } from '@angular/material/dialog';
import { endpoint } from 'src/app/modules/api-rest/enviroments/endpoints';

@Injectable({
  providedIn: 'root'
})
export class TaskService extends ListService<Task> {

  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    super();
    
  }

  //abstract methods
  override getAllItems(): Observable<Task[]> {
    this.http
      .get<ApiResponse>(PathRest.GET_TASKS)
      .pipe(map((response) => response.data),
      catchError(() => of([]))
      ).subscribe({
        next: (tasks) => {
          tasks.sort((a: any, b: any) => b._id.localeCompare(a._id));
          if (this.tasksSubject)
          this.tasksSubject.next(tasks);
        }
      });
    return this.tasks$;
  }

  override getItems(id: string): Observable<Task[]> {
    this.http
    .get<ApiResponse>(`${PathRest.GET_STORIES}/${id}${endpoint.TASKS}`)
    .pipe(map((response) => response.data),
    catchError(() => of([])))
    .subscribe({
      next: (tasks) => {
        tasks.sort((a: any, b: any) => b._id.localeCompare(a._id));
        if (this.tasksSubject) {
          this.tasksSubject.next(tasks);
        }
      }
    });
  return this.tasks$;
  }

  override getItemById(id: string): Observable<Task> {
    return this.http.get<ApiResponse>(`${PathRest.GET_TASKS}/${id}`)
    .pipe(map((response) => response.data));
  }

  override getItemName(id: string): Observable<string> {
    return this.getItemById(id).pipe(
      map((task: Task) => task.name)
    );
  }
  
  override createItem(item: Task): Observable<Task> {
    return this.http.post<ApiResponse>(PathRest.GET_TASKS, item)
    .pipe(map((response) => response.data));
  }

  override editItem(task: Task): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      data: { initialValues: task },
    });

    dialogRef.componentInstance.toggleIsEditing();
  }

  override updateItem(item: Task): Observable<Task | null> {
    return this.http
    .put<ApiResponse>(`${PathRest.GET_TASKS}/${item._id}`, item)
    .pipe(map((response) => response.data)
    ,catchError((error) => of(null))
    );
  }
  
  override deleteItem(id: string): Observable<Task | null> {
    return this.http
      .delete<ApiResponse>(`${PathRest.GET_TASKS}/${id}`)
      .pipe(
        map((response) => response.data),
        catchError(error => {
          return of(null);
        }),
        tap(() => {
          this.snackBar.open('Task deleted successfully.', 'Close', {
            duration: 5000,
          });
        })
      );
  }
}
