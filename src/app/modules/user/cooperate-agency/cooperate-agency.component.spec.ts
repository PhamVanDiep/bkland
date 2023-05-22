import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CooperateAgencyComponent } from './cooperate-agency.component';

describe('CooperateAgencyComponent', () => {
  let component: CooperateAgencyComponent;
  let fixture: ComponentFixture<CooperateAgencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CooperateAgencyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CooperateAgencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
