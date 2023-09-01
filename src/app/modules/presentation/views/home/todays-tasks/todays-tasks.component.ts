import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/modules/core/services/task/task.service';
import { Task } from 'src/app/modules/models/task.model';

@Component({
  selector: 'app-todays-tasks',
  templateUrl: './todays-tasks.component.html',
  styleUrls: ['./todays-tasks.component.scss'],
})
export class TodaysTasksComponent implements OnInit {
  loading: boolean = false;
  selectedTasks: Task[] = [];
  today: Date = new Date();

  constructor(private ts: TaskService) {
    this.today.setHours(0, 0, 0, 0);
  }

  ngOnInit(): void {
    this.ts.getAllItems().subscribe({
      next: (tasks) => {
        this.selectedTasks = tasks;
        this.selectedTasks = this.filterByDate(this.today, this.selectedTasks);
        this.loading = false;
      }
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
