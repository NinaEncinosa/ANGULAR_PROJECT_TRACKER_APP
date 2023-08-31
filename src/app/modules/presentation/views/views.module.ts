import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { MyProjectsComponent } from './my-projects/my-projects.component';
import { MyStoriesComponent } from './my-stories/my-stories.component';
import { SettingsComponent } from './settings/settings.component';
import { ProjectComponent } from './project/project.component';
import { EpicComponent } from './epic/epic.component';
import { StoryComponent } from './story/story.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HeaderComponent } from './home/header/header.component';
import { TodaysTasksComponent } from './home/todays-tasks/todays-tasks.component';



@NgModule({
  declarations: [
    HomeComponent,
    MyProjectsComponent,
    MyStoriesComponent,
    SettingsComponent,
    ProjectComponent,
    EpicComponent,
    StoryComponent,
    LoginComponent,
    PageNotFoundComponent,
    HeaderComponent,
    TodaysTasksComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule, 
    SharedModule,
    MaterialModule,
    SharedModule,
    BreadcrumbModule,
  ]
})
export class ViewsModule { }
