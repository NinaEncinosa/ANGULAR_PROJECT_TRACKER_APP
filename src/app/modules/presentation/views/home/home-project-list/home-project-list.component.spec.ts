import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeProjectListComponent } from './home-project-list.component';

describe('HomeProjectListComponent', () => {
  let component: HomeProjectListComponent;
  let fixture: ComponentFixture<HomeProjectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeProjectListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
