import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { CardListComponent } from './card-list/card-list.component';
import { ItemCardComponent } from './item-card/item-card.component';
import { RouterModule } from '@angular/router';
import { AddItemComponent } from './add-item/add-item.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { TaskCardComponent } from './task-card/task-card.component';
import { ProjectDetailsComponent } from './details/project-details/project-details.component';
import { EpicDetailsComponent } from './details/epic-details/epic-details.component';
import { StoryDetailsComponent } from './details/story-details/story-details.component';
import { IconPickerComponent } from './icon-picker/icon-picker.component';
import { NoItemsCardComponent } from './no-items-card/no-items-card.component';

@NgModule({
  declarations: [
    CardListComponent,
    ItemCardComponent,
    AddItemComponent,
    ConfirmationDialogComponent,
    TaskCardComponent,
    ProjectDetailsComponent,
    EpicDetailsComponent,
    StoryDetailsComponent,
    IconPickerComponent,
    NoItemsCardComponent,
    
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  exports: [
    CardListComponent,
    ItemCardComponent,
    AddItemComponent,
    TaskCardComponent,
    ProjectDetailsComponent,
    EpicDetailsComponent,
    StoryDetailsComponent,
    IconPickerComponent,
    NoItemsCardComponent,

  ]
}) export class SharedModule { }