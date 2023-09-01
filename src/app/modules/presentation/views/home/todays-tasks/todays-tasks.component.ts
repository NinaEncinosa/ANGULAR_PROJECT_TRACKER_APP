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
  ) {
    //asi machea la fecha con la guardada por datepicker
    this.today.setHours(0, 0, 0, 0);
  }

  ngOnInit(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.allTasks = tasks;
        this.selectedTasks = this.allTasks;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        alert('Error fetching tasks');
      }
    });
    this.selectedTasks = this.filterByDate(this.today, this.allTasks);
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
      this.taskService.filterByStatusValue = undefined;
      
    }
    if (selected.value === 'todo') {
      this.taskService.filterByStatusValue = false;
    }
    if (selected.value === 'done') {
      this.taskService.filterByStatusValue = true;
    }
    // this.taskService.getTasks().subscribe({
    //   next: (tasks) => {
    //     this.selectedTasks = tasks;
    //   },
    // });

  }
}
