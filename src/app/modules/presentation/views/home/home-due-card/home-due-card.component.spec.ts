import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeDueCardComponent } from './home-due-card.component';

describe('HomeDueCardComponent', () => {
  let component: HomeDueCardComponent;
  let fixture: ComponentFixture<HomeDueCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeDueCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeDueCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
