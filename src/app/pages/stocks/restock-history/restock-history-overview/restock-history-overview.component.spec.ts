import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestockHistoryOverviewComponent } from './restock-history-overview.component';

describe('RestockHistoryOverviewComponent', () => {
  let component: RestockHistoryOverviewComponent;
  let fixture: ComponentFixture<RestockHistoryOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestockHistoryOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RestockHistoryOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
