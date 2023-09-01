import { Component, OnInit } from '@angular/core';
import { Story } from 'src/app/modules/models/story';
import { Task } from 'src/app/modules/models/task.model';
import { StoryService } from 'src/app/modules/core/services/story/story.service';
import { Project } from 'src/app/modules/models/project.model';
import { EpicService } from 'src/app/modules/core/services/epic/epic.service';
import { TaskService } from 'src/app/modules/core/services/task/task.service';
import { ProjectService } from 'src/app/modules/core/services/project/project.service';
import { combineLatest } from 'rxjs';

interface iCards {
  name: string;
  value: number;
}

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss'],
})
export class GeneralInfoComponent implements OnInit{

  projects: Project[] = [];
  epics: any[] = [];
  stories: Story[] = [];
  tasks: Task[] = [];
  loading: boolean = true;
  cards: iCards[];
  cardColor: string = '#232837';
  
  constructor(private ps: ProjectService,private es:EpicService, private ss: StoryService, private ts: TaskService) {
    this.cards = [];
  }

  ngOnInit(): void {
    let data = [
      this.ps.getAllItems(),
      this.es.getAllItems(),
      this.ss.getAllItems(),
      this.ts.getAllItems()
    ];

    combineLatest(data).subscribe(
      (resp: any) => {
        this.projects = resp[0];
        this.epics = resp[1];
        this.stories = resp[2];
        this.tasks = resp[3];
        this.cards = [
          {name: 'Projects', value: this.projects.length},
          {name: 'Epics', value: this.epics.length},
          {name: 'Stories', value: this.stories.length},
          {name: 'Tasks', value: this.tasks.length}
        ]
        this.loading = false;
      }
    )

  }
  
  onSelect(event: any) {
    console.log(event);
  }

}
