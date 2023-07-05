import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceFluctuationStatisticComponent } from './price-fluctuation-statistic.component';

describe('PriceFluctuationStatisticComponent', () => {
  let component: PriceFluctuationStatisticComponent;
  let fixture: ComponentFixture<PriceFluctuationStatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceFluctuationStatisticComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceFluctuationStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
