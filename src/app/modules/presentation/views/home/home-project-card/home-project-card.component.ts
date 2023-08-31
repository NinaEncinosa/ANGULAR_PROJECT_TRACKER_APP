import { Component, Input, OnInit } from '@angular/core';
import { EpicService } from 'src/app/modules/core/services/epic/epic.service';
import { ProjectService } from 'src/app/modules/core/services/project/project.service';
import { StoryService } from 'src/app/modules/core/services/story/story.service';
import { Project } from 'src/app/modules/models/project.model';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/modules/api-rest/services/auth.service';

@Component({
  selector: 'app-home-project-card',
  templateUrl: './home-project-card.component.html',
  styleUrls: ['./home-project-card.component.scss']
})
export class HomeProjectCardComponent implements OnInit {
  @Input() project!: Project;
  epics!: string[];
  stories!: string[];
  tasks!: string[];
  loading: boolean = true;

  constructor(
    private authService: AuthService,
    private projectService: ProjectService,
    private epicService: EpicService,
    private storyService: StoryService,
  ) {}

  ngOnInit(): void {
    this.projectService.getEpicsIds(this.project._id)
      .pipe(
        switchMap(epicsIds => this.processEpics(epicsIds)),
        catchError(() => this.handleError())
      )
      .subscribe();
  }
  
  private processEpics(epicsIds: string[]): Observable<void> {
    this.epics = epicsIds;
  
    if (this.epics.length === 0) {
      this.loading = false;
      return of(undefined);
    }
  
    const storyObservables = this.epics.map(epic => this.epicService.getStoriesIds(epic));
  
    return forkJoin(storyObservables)
      .pipe(
        switchMap(resolvedStoryIdsArray => this.processStories(resolvedStoryIdsArray)),
        catchError(() => this.handleError())
      );
  }
  
  private processStories(storiesIdsArray: string[][]): Observable<void> {
    const allStoryIds = storiesIdsArray.flat();
    this.stories = allStoryIds;
  
    if (this.stories.length === 0) {
      this.loading = false;
      return of(undefined);
    }
  
    const taskObservables = this.stories.map(story => this.storyService.getTasksIds(story));
  
    return forkJoin(taskObservables)
      .pipe(
        switchMap(tasksIdsArray => this.processTasks(tasksIdsArray)),
        catchError(() => this.handleError())
      );
  }
  
  private processTasks(tasksIdsArray: string[][]): Observable<void> {    
    const allTaskIds = tasksIdsArray.flat();
    this.tasks = allTaskIds;
  
    if (this.tasks.length === 0) {
      this.loading = false;
      return of(undefined);
    }
  
    this.loading = false;
    return of(undefined);
  }
  
  private handleError(): Observable<void> {
    this.loading = false;
    return of(undefined);
  } 
  

  get totalEpics(): number {
    return this.epics ? this.epics.length : 0;
  }

  get totalStories(): number {
    return this.stories ? this.stories.length : 0;
  }

  get totalTasks(): number {
    return this.tasks ? this.tasks.length : 0;
  }

  isOwner(): boolean {
    const user = this.authService.getUserId();
    return user == this.project.owner;
  }

}
