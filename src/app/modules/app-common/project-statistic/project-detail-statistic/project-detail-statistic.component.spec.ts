import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailStatisticComponent } from './project-detail-statistic.component';

describe('ProjectDetailStatisticComponent', () => {
  let component: ProjectDetailStatisticComponent;
  let fixture: ComponentFixture<ProjectDetailStatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDetailStatisticComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectDetailStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
