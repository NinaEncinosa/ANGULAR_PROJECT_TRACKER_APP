import { Component, Input, OnInit } from '@angular/core';
import { Story } from 'src/app/modules/models/story';
import { Task } from 'src/app/modules/models/task.model';

@Component({
  selector: 'app-home-due-list',
  templateUrl: './home-due-list.component.html',
  styleUrls: ['./home-due-list.component.scss'],
})
export class HomeDueListComponent implements OnInit {
  @Input() items!: (Story | Task)[];

  ngOnInit(): void {
    
  }
}
