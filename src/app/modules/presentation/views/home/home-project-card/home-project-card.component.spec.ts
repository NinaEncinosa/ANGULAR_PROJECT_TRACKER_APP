import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeProjectCardComponent } from './home-project-card.component';

describe('HomeProjectCardComponent', () => {
  let component: HomeProjectCardComponent;
  let fixture: ComponentFixture<HomeProjectCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeProjectCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeProjectCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
