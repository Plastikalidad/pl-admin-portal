import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAdjustmentDetailComponent } from './stock-adjustment-detail.component';

describe('StockAdjustmentDetailComponent', () => {
  let component: StockAdjustmentDetailComponent;
  let fixture: ComponentFixture<StockAdjustmentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockAdjustmentDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StockAdjustmentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
