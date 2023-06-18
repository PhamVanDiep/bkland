import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealEstatePostViewComponent } from './real-estate-post-view.component';

describe('RealEstatePostViewComponent', () => {
  let component: RealEstatePostViewComponent;
  let fixture: ComponentFixture<RealEstatePostViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RealEstatePostViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealEstatePostViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
