import { Component, Input } from '@angular/core';
import { Epic } from 'src/app/modules/models/epic.model';
import { ProjectService } from '../../../../core/services/project/project.service';

@Component({
  selector: 'app-epic-details',
  templateUrl: './epic-details.component.html',
  styleUrls: ['./epic-details.component.scss']
})
export class EpicDetailsComponent {

  panelOpenState = false;
  @Input() item !: Epic ;

  projectName !:string;

  constructor(
    private project: ProjectService
  ) {}

  ngOnInit(): void {
    if (this.item) {
     this.project.getItemById(this.item.project).subscribe( project => this.projectName = project.name );
    }
  }

}
