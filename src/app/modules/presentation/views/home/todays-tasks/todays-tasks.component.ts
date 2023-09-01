import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { StoryService } from 'src/app/modules/core/services/story/story.service';
import { TaskService } from 'src/app/modules/core/services/task/task.service';
import { Story } from 'src/app/modules/models/story';
import { Task } from 'src/app/modules/models/task.model';

@Component({
  selector: 'app-todays-tasks',
  templateUrl: './todays-tasks.component.html',
  styleUrls: ['./todays-tasks.component.scss'],
})
export class TodaysTasksComponent implements OnInit {
  loading: boolean = false;
  stories: Story[] = [];
  storiesIds: string[] = [];
  selectedTasks: Task[] = [];
  today: Date = new Date();

  constructor(private ts: TaskService, private ss: StoryService) {
    this.today.setHours(0, 0, 0, 0);
  }

  ngOnInit(): void {
    let data = [
      this.ss.getAllItems(),
      this.ts.getAllItems(),
    ]

    combineLatest(data).subscribe((resp: any) => {
      this.stories = resp[0];
      //obtengo los ids de las stories que son mias
      for (let i = 0; i < this.stories.length; i++) {
        if(!this.storiesIds.includes(this.stories[i]._id))
          this.storiesIds.push(this.stories[i]._id);
      }
      this.selectedTasks = resp[1];
      this.selectedTasks = this.selectedTasks.filter((task) =>
        this.storiesIds.includes(task.story)
      );
      this.selectedTasks = this.filterByDate(this.today, this.selectedTasks);
      this.loading = false;
    }); 
  }

  filterByDate(today: Date, list: Task[]): Task[] {
    let filteredList: Task[] = [];
    list.forEach((task) => {
      if (task.due) {
        let taskDate: Date | undefined = new Date(task.due);
        if (taskDate) {
          if (!(taskDate > today) && !(taskDate < today)) {
            filteredList.push(task);
          }
        }
      }
    });
    return filteredList;
  }

  onChange(event: any) {
    switch (event.value) {
      case 'all':
        this.ts.filterByStatusValue = undefined;
        break;
      case 'done':
        this.ts.filterByStatusValue = true;
        break;
      case 'todo':
        this.ts.filterByStatusValue = false;
        break;
      default:
        break;
    }
    this.ts.getAllItems().subscribe({
      next: (tasks) => {
        this.selectedTasks = tasks;
        this.selectedTasks = this.filterByDate(this.today, this.selectedTasks);
      }
    });
  }

}
