import { Component, OnInit } from '@angular/core';
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
  loading: boolean = true;
  stories: Story[] = [];
  allTasks: Task[] = [];
  selectedTasks: Task[] = [];
  today: Date = new Date();

  constructor(
    private taskService: TaskService,
    private StoryService: StoryService
  ) {
    //asi machea la fecha con la guardada por datepicker
    this.today.setHours(0, 0, 0, 0);
  }

  ngOnInit(): void {
    this.StoryService.getAllItems().subscribe({
      next: (stories) => {
        stories.forEach((story) => {
          this.StoryService.getTasksByStory(story._id).subscribe({
            next: (tasks) => {
              this.allTasks = this.allTasks.concat(tasks);
              this.selectedTasks = this.filterByDate(this.today, this.allTasks);
              this.loading = false;
            },
          });
        });
      },
    });
  }

  filterByDate(filterDate: Date, list: Task[]): Task[] {
    let filteredList: Task[] = [];
    list.forEach((task) => {
      if (task.due) {
        let taskDate: Date | undefined = new Date(task.due);
        if (taskDate) {
          if (!(taskDate > filterDate) && !(taskDate < filterDate)) {
            filteredList.push(task);
          }
        }
      }
    });
    return filteredList;
  }

  onChange(selected: any) {
    if (selected.value === 'all') {
      this.selectedTasks = this.allTasks;
      this.selectedTasks = this.filterByDate(this.today, this.allTasks);
    }
    if (selected.value === 'todo') {
      this.selectedTasks = this.allTasks.filter((task) => task.done == false);
      this.selectedTasks = this.filterByDate(this.today, this.selectedTasks);
    }
    if (selected.value === 'done') {
      this.selectedTasks = this.allTasks.filter((task) => task.done == true);
      this.selectedTasks = this.filterByDate(this.today, this.selectedTasks);
    }
  }
}
