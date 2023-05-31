import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPostDetailComponent } from './info-post-detail.component';

describe('InfoPostDetailComponent', () => {
  let component: InfoPostDetailComponent;
  let fixture: ComponentFixture<InfoPostDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoPostDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoPostDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
