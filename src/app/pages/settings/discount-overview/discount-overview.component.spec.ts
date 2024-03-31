import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountOverviewComponent } from './discount-overview.component';

describe('DiscountOverviewComponent', () => {
  let component: DiscountOverviewComponent;
  let fixture: ComponentFixture<DiscountOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscountOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiscountOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
