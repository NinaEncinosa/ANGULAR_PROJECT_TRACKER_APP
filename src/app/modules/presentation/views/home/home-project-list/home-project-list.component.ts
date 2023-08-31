import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/modules/core/services/project/project.service';
import { Project } from 'src/app/modules/models/project.model';
import { puffAnimation } from 'src/assets/styles/animations';

@Component({
  selector: 'app-home-project-list',
  templateUrl: './home-project-list.component.html',
  styleUrls: ['./home-project-list.component.scss'],
  animations:[puffAnimation],
})
export class HomeProjectListComponent implements OnInit {
  projects: Project[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.getAllItems().subscribe(
      projects => {
        this.projects = projects;
      }
    )  
  }  

}
