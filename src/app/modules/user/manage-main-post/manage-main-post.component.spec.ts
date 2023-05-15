import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMainPostComponent } from './manage-main-post.component';

describe('ManageMainPostComponent', () => {
  let component: ManageMainPostComponent;
  let fixture: ComponentFixture<ManageMainPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageMainPostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageMainPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
