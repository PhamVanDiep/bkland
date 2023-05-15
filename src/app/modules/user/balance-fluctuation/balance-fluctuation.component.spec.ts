import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceFluctuationComponent } from './balance-fluctuation.component';

describe('BalanceFluctuationComponent', () => {
  let component: BalanceFluctuationComponent;
  let fixture: ComponentFixture<BalanceFluctuationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalanceFluctuationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceFluctuationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
