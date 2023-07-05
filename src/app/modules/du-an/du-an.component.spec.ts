import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuAnComponent } from './du-an.component';

describe('DuAnComponent', () => {
  let component: DuAnComponent;
  let fixture: ComponentFixture<DuAnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DuAnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuAnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
