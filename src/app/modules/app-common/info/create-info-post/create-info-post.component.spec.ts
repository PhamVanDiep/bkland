import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInfoPostComponent } from './create-info-post.component';

describe('CreateInfoPostComponent', () => {
  let component: CreateInfoPostComponent;
  let fixture: ComponentFixture<CreateInfoPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateInfoPostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateInfoPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
