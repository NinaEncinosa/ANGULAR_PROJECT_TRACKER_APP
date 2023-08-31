import { Component, Input, OnInit } from '@angular/core';
import { Item } from 'src/app/modules/models/item.model';
import { Story } from 'src/app/modules/models/story';
import { Task } from 'src/app/modules/models/task.model';
import { puffAnimation } from 'src/assets/styles/animations';

@Component({
  selector: 'app-home-due-list',
  templateUrl: './home-due-list.component.html',
  styleUrls: ['./home-due-list.component.scss'],
  animations:[puffAnimation],
})
export class HomeDueListComponent implements OnInit {
  @Input() items!: (Story | Task)[];

  ngOnInit(): void {
    
  }
}
