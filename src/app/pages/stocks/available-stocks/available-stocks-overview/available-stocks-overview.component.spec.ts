import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableStocksOverviewComponent } from './available-stocks-overview.component';

describe('AvailableStocksOverviewComponent', () => {
  let component: AvailableStocksOverviewComponent;
  let fixture: ComponentFixture<AvailableStocksOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableStocksOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvailableStocksOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
