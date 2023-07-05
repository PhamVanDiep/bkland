import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepStatisticComponent } from './rep-statistic.component';

describe('RepStatisticComponent', () => {
  let component: RepStatisticComponent;
  let fixture: ComponentFixture<RepStatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepStatisticComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
