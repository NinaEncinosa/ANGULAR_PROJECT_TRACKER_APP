import { Component, Input, OnInit } from '@angular/core';
import { EpicService } from 'src/app/modules/core/services/epic/epic.service';
import { ProjectService } from 'src/app/modules/core/services/project/project.service';
import { StoryService } from 'src/app/modules/core/services/story/story.service';
import { TaskService } from 'src/app/modules/core/services/task/task.service';
import { Epic } from 'src/app/modules/models/epic.model';
import { Project } from 'src/app/modules/models/project.model';
import { Story } from 'src/app/modules/models/story';
import { Task } from 'src/app/modules/models/task.model';

@Component({
  selector: 'app-home-project-card',
  templateUrl: './home-project-card.component.html',
  styleUrls: ['./home-project-card.component.scss']
})
export class HomeProjectCardComponent implements OnInit {
  @Input() project!: Project;
  epics!: Epic[];
  stories!: Story[];
  tasks!: Task[];

  constructor(
    private projectService: ProjectService,
    private epicService: EpicService,
    private storyService: StoryService,
    private taskService: TaskService,
  ) {}

  ngOnInit(): void {
    this.getEpics();
  }

  getEpics() {
    this.projectService.getEpicsByProject(this.project._id).subscribe(
      result => {this.epics = result}
    );
  }

  getStories() {

  }

  getTasks() {

  }

}
