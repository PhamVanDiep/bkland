import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanhMucComponent } from './danh-muc.component';

describe('DanhMucComponent', () => {
  let component: DanhMucComponent;
  let fixture: ComponentFixture<DanhMucComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DanhMucComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DanhMucComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
