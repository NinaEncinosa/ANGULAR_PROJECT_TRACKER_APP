import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodaysTasksComponent } from './todays-tasks.component';

describe('TodaysTasksComponent', () => {
  let component: TodaysTasksComponent;
  let fixture: ComponentFixture<TodaysTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodaysTasksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodaysTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
