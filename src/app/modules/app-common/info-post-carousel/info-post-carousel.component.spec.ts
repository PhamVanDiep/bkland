import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPostCarouselComponent } from './info-post-carousel.component';

describe('InfoPostCarouselComponent', () => {
  let component: InfoPostCarouselComponent;
  let fixture: ComponentFixture<InfoPostCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoPostCarouselComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoPostCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
