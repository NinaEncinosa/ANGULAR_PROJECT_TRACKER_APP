import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { MaterialModule } from '../../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { FeatureModule } from '../feature/feature.module';
import { RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { BreadcrumbComponent } from './header/breadcrumb/breadcrumb.component';


@NgModule({
  declarations: [
    HeaderComponent,
    MainComponent,
    BreadcrumbComponent,
    
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FeatureModule,
    SharedModule,
    RouterModule,
    BreadcrumbModule
  ],
  exports: [
    HeaderComponent,
    MainComponent
  ]
})
export class CoreModule { }
