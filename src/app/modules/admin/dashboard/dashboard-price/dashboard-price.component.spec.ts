import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPriceComponent } from './dashboard-price.component';

describe('DashboardPriceComponent', () => {
  let component: DashboardPriceComponent;
  let fixture: ComponentFixture<DashboardPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardPriceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
