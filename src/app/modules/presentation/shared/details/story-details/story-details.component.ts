import { Component, Input } from '@angular/core';
import { EpicService } from 'src/app/modules/core/services/epic/epic.service';
import { UserService } from 'src/app/modules/core/services/user/user.service';
import { Status } from 'src/app/modules/models/enum';
import { Story } from 'src/app/modules/models/story';
import { User } from 'src/app/modules/models/user';

@Component({
  selector: 'app-story-details',
  templateUrl: './story-details.component.html',
  styleUrls: ['./story-details.component.scss'],
})
export class StoryDetailsComponent {
  panelOpenState = false;
  @Input() item!: Story;

  Status !: Status ;
  epicName!: string;

  ownerName!: string | null;
  members: string[] = [];
  userService: any;

  constructor(private es: EpicService, private us: UserService) {}

  ngOnInit(): void {
    if (this.item) {
      this.es
        .getItemById(this.item.epic)
        .subscribe((epic) => (this.epicName = epic.name));

      this.us
        .getMembersNames(this.item.assignedTo)
        .subscribe((membersNames) => {
          this.members = membersNames;
        });

      if (this.item.owner) {
        this.us.getUserById(this.item.owner).subscribe((owner: User | null) => {
          if (owner) {
            this.ownerName = `${owner.name.first} ${owner.name.last}`;
          }
        });
      }
    }
  }

}
