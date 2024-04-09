import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAdjustmentOverviewComponent } from './stock-adjustment-overview.component';

describe('StockAdjustmentOverviewComponent', () => {
  let component: StockAdjustmentOverviewComponent;
  let fixture: ComponentFixture<StockAdjustmentOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockAdjustmentOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StockAdjustmentOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
