import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeDueListComponent } from './home-due-list.component';

describe('HomeDueListComponent', () => {
  let component: HomeDueListComponent;
  let fixture: ComponentFixture<HomeDueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeDueListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeDueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
