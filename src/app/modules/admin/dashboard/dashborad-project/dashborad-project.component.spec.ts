import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboradProjectComponent } from './dashborad-project.component';

describe('DashboradProjectComponent', () => {
  let component: DashboradProjectComponent;
  let fixture: ComponentFixture<DashboradProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboradProjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboradProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
