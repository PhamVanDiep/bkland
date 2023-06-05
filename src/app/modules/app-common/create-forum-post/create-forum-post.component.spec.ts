import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateForumPostComponent } from './create-forum-post.component';

describe('CreateForumPostComponent', () => {
  let component: CreateForumPostComponent;
  let fixture: ComponentFixture<CreateForumPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateForumPostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateForumPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
