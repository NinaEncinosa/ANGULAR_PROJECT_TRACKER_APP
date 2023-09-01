import { Component, Input } from '@angular/core';
import { UserService } from 'src/app/modules/core/services/user/user.service';
import { Project } from 'src/app/modules/models/project.model';
import { User } from 'src/app/modules/models/user';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent {
  panelOpenState = false;
  @Input() project !: Project ;
  members: string[] = [];
  ownerName!: string;


  constructor(
    private userService: UserService
  ) {}

  ngOnInit(): void {
    if (this.project) {
      this.userService.getMembersNames(this.project.members).subscribe(
        membersNames => {
          this.members = membersNames;
        }
      );
      
      this.userService.getUserById(this.project.owner).subscribe(
        (owner: User | null) => {
          if (owner) {
            this.ownerName = `${owner.name.first} ${owner.name.last}`;
          }
        }
      );
    }
  }

}


