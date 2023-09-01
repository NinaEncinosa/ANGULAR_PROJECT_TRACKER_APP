import { Component, OnInit } from '@angular/core';
import { Story } from 'src/app/modules/models/story';
import { Task } from 'src/app/modules/models/task.model';
import { StoryService } from 'src/app/modules/core/services/story/story.service';
import { Project } from 'src/app/modules/models/project.model';
import { EpicService } from 'src/app/modules/core/services/epic/epic.service';
import { TaskService } from 'src/app/modules/core/services/task/task.service';
import { ProjectService } from 'src/app/modules/core/services/project/project.service';
import { combineLatest, forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

interface iCards {
  name: string;
  value: number;
}

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss'],
})
export class GeneralInfoComponent implements OnInit {
  projects: Project[] = [];
  projectsIds: string[] = [];
  epics: any[] = [];
  stories: Story[] = [];
  storiesIds: string[] = [];
  tasks: Task[] = [];
  loading: boolean = true;
  cards: iCards[];
  cardColor: string = '#232837';

  constructor(
    private ps: ProjectService,
    private es: EpicService,
    private ss: StoryService,
    private ts: TaskService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.cards = [];
  }

  ngOnInit(): void {
    let data = [
      this.ps.getAllItems(),
      this.es.getAllItems(),
      this.ss.getAllItems(),
      this.ts.getAllItems(),
    ];
    combineLatest(data).subscribe((resp: any) => {
      this.projects = resp[0];
      //obtengo los ids de los projectos que son mios
      for (let i = 0; i < this.projects.length; i++) {
        if(!this.projectsIds.includes(this.projects[i]._id)) 
          this.projectsIds.push(this.projects[i]._id);
      }
      this.epics = resp[1];
      //obtengo los epics que son de mis proyectos
      this.epics = this.epics.filter((epic) =>
        this.projectsIds.includes(epic.project)
      );
      this.stories = resp[2];
      //obtengo los ids de las stories que son mias
      for (let i = 0; i < this.stories.length; i++) {
        if(!this.storiesIds.includes(this.stories[i]._id))
          this.storiesIds.push(this.stories[i]._id);
      }
      this.tasks = resp[3];
      this.tasks = this.tasks.filter((task) =>
        this.storiesIds.includes(task.story)
      );

      this.cards = [
        { name: 'Projects', value: this.projects.length },
        { name: 'Epics', value: this.epics.length },
        { name: 'Stories', value: this.stories.length },
        { name: 'Tasks', value: this.tasks.length },
      ];
      this.loading = false;
    });
  }

  onSelect(event: any) {
    //redirect to project
    if (event.name === 'Projects') {
      this.router.navigate(['/my-projects']);
    }
    //redirect to epic
    if (event.name === 'Epics') {
      this.snackBar.open('My-Epics is not implemented yet', 'OK', {
        duration: 3000,
        panelClass: ['mat-toolbar', 'mat-primary'],
      });
    }
    //redirect to story
    if (event.name === 'Stories') {
      this.router.navigate(['/my-stories']);
    }
    //redirect to task
    if (event.name === 'Tasks') {
      this.snackBar.open('My-Tasks is not implemented yet', 'OK', {
        duration: 3000,
        panelClass: ['mat-toolbar', 'mat-primary'],
      });
    }
  }

}
