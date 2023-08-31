import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/modules/models/user';
import { UserService } from 'src/app/modules/core/services/user/user.service';
import { AuthService } from 'src/app/modules/api-rest/services/auth.service';
import { Story } from 'src/app/modules/models/story';
import { Task } from 'src/app/modules/models/task.model';
import { StoryService } from 'src/app/modules/core/services/story/story.service';
import { TaskService } from 'src/app/modules/core/services/task/task.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user!: User | null;
  loading: boolean = true;
  dueStories: Story[] = [];
  dueTasks: Task[] = [];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private storyService: StoryService,
    private taskService: TaskService,
  ) { }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.userService.getUserById(userId).subscribe(
        (user) => {
          this.user = user;
          this.loading = false;
        }
      );

      this.storyService.getAllItems().subscribe(
        stories => {
          this.dueStories = stories.filter(story =>{           
            return story.status !== 'done' && this.nextDue(story.due)            
          });
        }
      );

      this.taskService.getAllItems().subscribe(
        tasks => {         
          this.dueTasks = tasks.filter(task => {
            return !task.done && this.nextDue(task.due)
          });
        }
      );      
    }    
  }

  nextDue(dueDate: Date | undefined): boolean {
    if (!dueDate) {
      return false;
    }
    const currentDate = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(currentDate.getDate() + 3);
    const dueDateObj = new Date(dueDate);
    return dueDateObj >= currentDate && dueDateObj <= threeDaysFromNow;
  }
}
