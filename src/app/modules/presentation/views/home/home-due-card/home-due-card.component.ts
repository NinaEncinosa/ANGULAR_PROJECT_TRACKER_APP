import { Component, Input, OnInit } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { EpicService } from 'src/app/modules/core/services/epic/epic.service';
import { ProjectService } from 'src/app/modules/core/services/project/project.service';
import { StoryService } from 'src/app/modules/core/services/story/story.service';
import { Story } from 'src/app/modules/models/story';
import { Task } from 'src/app/modules/models/task.model';

@Component({
  selector: 'app-home-due-card',
  templateUrl: './home-due-card.component.html',
  styleUrls: ['./home-due-card.component.scss']
})
export class HomeDueCardComponent implements OnInit {
  @Input() item!: Story | Task;
  dueDate!: Date | undefined;
  itemPath: string = '';
  loading: boolean = true;
  
  constructor(
    private projectService: ProjectService,
    private epicService: EpicService,
    private storyService: StoryService,
  ) {}

  ngOnInit(): void {
    this.getItemPath().subscribe(path => {
      this.itemPath = path;
      this.loading = false;
    });
  }

  private getItemPath(): Observable<string> {
    if ('epic' in this.item) {
      return this.getStoryPath(this.item);
    } else if ('story' in this.item) {
      return this.getTaskPath(this.item);
    }
    return of('');
  }

  private getStoryPath(story: Story): Observable<string> {
    if (!story.epic) {
      return of('');
    }
    
    const epicId = story.epic;
    const epic$ = this.epicService.getItemById(epicId);
  
    return epic$.pipe(
      switchMap(epic => {
        const project$ = this.projectService.getItemById(epic.project);
        return project$.pipe(
          switchMap(project => of(`${project.name} > ${epic.name}`))
        );
      })
    );
  }
  
  private getTaskPath(task: Task): Observable<string> {   
    if (!task.story ) {      
      return of(''); 
    }
    
    const storyId = task.story;    
    const story$ = this.storyService.getItemById(storyId);
  
    return story$.pipe(
      switchMap(story => {
        const epic$ = this.epicService.getItemById(story.epic);
        return epic$.pipe(
          switchMap(epic => {
            const project$ = this.projectService.getItemById(epic.project);
            return project$.pipe(
              switchMap(project => of(`${project.name} > ${epic.name} > ${story.name}`))
            );
          })
        );
      })
    );
  }
  
  
}

