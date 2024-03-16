import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestockHistoryDetailComponent } from './restock-history-detail.component';

describe('RestockHistoryDetailComponent', () => {
  let component: RestockHistoryDetailComponent;
  let fixture: ComponentFixture<RestockHistoryDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestockHistoryDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RestockHistoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
