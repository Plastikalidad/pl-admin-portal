import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleViewStockComponent } from './simple-view-stock.component';

describe('SimpleViewStockComponent', () => {
  let component: SimpleViewStockComponent;
  let fixture: ComponentFixture<SimpleViewStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleViewStockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SimpleViewStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
