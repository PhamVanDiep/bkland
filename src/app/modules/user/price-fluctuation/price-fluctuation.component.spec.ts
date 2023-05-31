import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceFluctuationComponent } from './price-fluctuation.component';

describe('PriceFluctuationComponent', () => {
  let component: PriceFluctuationComponent;
  let fixture: ComponentFixture<PriceFluctuationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceFluctuationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceFluctuationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
