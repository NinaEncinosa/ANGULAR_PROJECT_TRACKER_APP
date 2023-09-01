import { Component } from '@angular/core';
import { LIST_SERVICE_TOKEN } from 'src/app/modules/core/services/list/list.service';
import { StoryService } from 'src/app/modules/core/services/story/story.service';
import { Status } from 'src/app/modules/models/enum';
import { Story } from 'src/app/modules/models/story';

@Component({
  selector: 'app-my-stories',
  templateUrl: './my-stories.component.html',
  styleUrls: ['./my-stories.component.scss'],
  providers: [{
    provide: LIST_SERVICE_TOKEN,
    useExisting: StoryService,
  }],
})

export class MyStoriesComponent {
  loading: boolean = true;
  selectedStories: Story[] = [];
  allstories: Story[] = [];

  constructor(private storyService: StoryService) {}

  ngOnInit(): void {
    this.storyService.getAllItems().subscribe({
      next: (stories) => {
        this.allstories = stories;
        this.selectedStories = stories;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        alert('Error fetching stories');
      }
    }
    );
  }

  onChange(selected: any) {
    switch (selected.value) {
      case 'all':
        this.storyService.filterStatusValue = undefined;
        break;
      case 'todo':
        this.storyService.filterStatusValue = Status.Todo;
        break;
      case 'running':
        this.storyService.filterStatusValue = Status.Running;
        break;
      case 'done':
        this.storyService.filterStatusValue = Status.Done;
        break;
      default:
        this.storyService.filterStatusValue = undefined;
        break;
    }
    //el service se encarga de hacer el filtrado segun el valor asignado a filterStatusValue
    this.storyService.getAllItems().subscribe(
      stories => {
        this.selectedStories = stories;
      }
    );
  }

}
