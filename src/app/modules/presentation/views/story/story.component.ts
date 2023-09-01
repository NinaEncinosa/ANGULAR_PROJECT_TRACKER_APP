import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoryService } from 'src/app/modules/core/services/story/story.service';
import { TaskService } from 'src/app/modules/core/services/task/task.service';
import { Story } from 'src/app/modules/models/story';
import { Task } from 'src/app/modules/models/task.model';
import { TaskFormComponent } from '../../feature/forms/task-form/task-form.component';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss'],
})
export class StoryComponent {
  id!: string;
  story!: Story;
  loading: boolean = true;
  tasks: Task[] = [];
  tasksServ: any;
  formComponent: any;
  parentItemId: string | undefined;;

  constructor(
    private route: ActivatedRoute,
    private storyService: StoryService,
    private breadcrumbService: BreadcrumbService,
    private taskService: TaskService
  ) {
    this.formComponent = TaskFormComponent;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('story-id');

      if (id) {
        //nombre inicial del breadcrumb
        this.breadcrumbService.set('@Story', 'Story ');

        //traigo los datos de la story para mostrar la descripción
        this.storyService.getItemById(id).subscribe({
          next: (story) => {
            this.story = story;
          },
          error: (error) => {
            this.loading = false;
            alert('Error fetching story');
          },
          complete: () => {
            this.loading = false;
          },
        });

        //traigo las tareas de la story
        this.taskService.getItems(id).subscribe({
          next: (tasks) => {
            this.tasks = tasks;
          },
          error: (error) => {
            this.loading = false;
            alert('Error fetching tasks');
          },
          complete: () => {
            this.loading = false;
          },
        });

        //traigo el nombre del story para mostrar en el breadcrumb
        this.storyService.getItemName(id).subscribe(
          storyName => {
            this.breadcrumbService.set('@Story', `${storyName}`);
        });
      }
    });
  }
}
