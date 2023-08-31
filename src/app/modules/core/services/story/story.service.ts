import { Injectable } from '@angular/core';
import { ListService } from '../list/list.service';
import { Story } from 'src/app/modules/models/story';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PathRest } from 'src/app/modules/api-rest/enviroments/path-rest';
import { endpoint } from 'src/app/modules/api-rest/enviroments/endpoints';
import { ApiResponse } from 'src/app/modules/models/apiResponse';
import { Task } from 'src/app/modules/models/task.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { StoryFormComponent } from 'src/app/modules/presentation/feature/forms/story-form/story-form.component';
import { Status } from 'src/app/modules/models/enum';

@Injectable({
  providedIn: 'root',
})

export class StoryService extends ListService<Story> {
  
  private storiesSubject = new BehaviorSubject<Story[]>([]);
  stories$ = this.storiesSubject.asObservable();
  filterStatus: Status | undefined;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    super();
  }

  set filterStatusValue(value: Status | undefined) {
    this.filterStatus = value;
  }

  get filterStatusValue(): Status | undefined {
    return this.filterStatus;
  }

  //abstract methods
  override getAllItems(): Observable<Story[]> {
    this.http
    .get<ApiResponse>(PathRest.GET_STORIES)
    .pipe(map((response) => response.data))
    .subscribe({
      next: (stories) => {
        stories.sort((a: any, b: any) => b._id.localeCompare(a._id));
        if (this.filterStatus){
          stories = stories.filter((story: { status: Status; }) => story.status === this.filterStatus);
        }
        if (this.storiesSubject){
          this.storiesSubject.next(stories);
        }
      }
    });
  return this.stories$;
  }

  override getItems(id: string): Observable<Story[]> {
      this.http
      .get<ApiResponse>(`${PathRest.GET_EPICS}/${id}${endpoint.STORIES}`)
      .pipe(map((response) => response.data),
      catchError(() => of([])))
      .subscribe({
        next: (stories) => {
          stories.sort((a: any, b: any) => b._id.localeCompare(a._id));
          if (this.storiesSubject) {
            this.storiesSubject.next(stories);
          }
        }
      });
    return this.stories$;
  }

  override getItemById(id: string): Observable<Story> {
    return this.http
    .get<ApiResponse>(`${PathRest.GET_STORIES}/${id}`)
    .pipe(map((response) => response.data));
  }

  override getItemName(id: string): Observable<string> {
    return this.getItemById(id).pipe(
      map((story: Story) => story.name)
    );
  }

  override createItem(item: Story): Observable<Story> {
    return this.http
      .post<ApiResponse>(PathRest.GET_STORIES, item)
      .pipe(map((response) => response.data));
  }

  override editItem(story: Story): void {
    const dialogRef = this.dialog.open(StoryFormComponent, {
      data: { initialValues: story },
    });

    dialogRef.componentInstance.toggleIsEditing();
  }

  override updateItem(item: Story): Observable<Story | null> {
    return this.http
      .put<ApiResponse>(`${PathRest.GET_STORIES}/${item._id}`, item)
      .pipe(
        map((response) => response.data),
        catchError(() => of(null))
      );
  }

  override deleteItem(id: string): Observable<Story | null> {
    return this.getTasksByStory(id).pipe(
      switchMap((tasks) => {
        if (tasks.length > 0) {
          this.snackBar.open(
            'This story has associated tasks and cannot be deleted.',
            'Close',
            {
              duration: 5000,
            }
          );
          return of(null);
        } else {
          return this.http
            .delete<ApiResponse>(`${PathRest.GET_STORIES}/${id}`)
            .pipe(
              map((response) => response.data),
              catchError((error) => {
                console.log(error);
                return of(null);
              }),
              tap(() => {
                this.snackBar.open('Story deleted successfully.', 'Close', {
                  duration: 5000,
                });
              })
            );
        }
      })
    );
  }

  //sirve para el delete que saber si tiene tasks asociadas
  getTasksByStory(id: string): Observable<Task[]> {  
    return this.http.get<ApiResponse>(`${PathRest.GET_STORIES}/${id}${endpoint.TASKS}`).pipe(
      map((response) => response.data),
      catchError(() => of([]))
    );
  }

  getTasksIds(id: string): Observable<string[]> {
    return this.getTasksByStory(id).pipe(
      map(tasks => tasks.map(task => task._id))
    );
  }  

}
