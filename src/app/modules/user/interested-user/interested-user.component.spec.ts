import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestedUserComponent } from './interested-user.component';

describe('InterestedUserComponent', () => {
  let component: InterestedUserComponent;
  let fixture: ComponentFixture<InterestedUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterestedUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterestedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
