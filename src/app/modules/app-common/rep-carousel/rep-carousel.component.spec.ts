import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepCarouselComponent } from './rep-carousel.component';

describe('RepCarouselComponent', () => {
  let component: RepCarouselComponent;
  let fixture: ComponentFixture<RepCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepCarouselComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
