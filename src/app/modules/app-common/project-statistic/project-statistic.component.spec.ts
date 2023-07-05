import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStatisticComponent } from './project-statistic.component';

describe('ProjectStatisticComponent', () => {
  let component: ProjectStatisticComponent;
  let fixture: ComponentFixture<ProjectStatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectStatisticComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
