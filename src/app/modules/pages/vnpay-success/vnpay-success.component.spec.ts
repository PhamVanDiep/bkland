import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VnpaySuccessComponent } from './vnpay-success.component';

describe('VnpaySuccessComponent', () => {
  let component: VnpaySuccessComponent;
  let fixture: ComponentFixture<VnpaySuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VnpaySuccessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VnpaySuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
