import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMainPostComponent } from './create-main-post.component';

describe('CreateMainPostComponent', () => {
  let component: CreateMainPostComponent;
  let fixture: ComponentFixture<CreateMainPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateMainPostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMainPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
