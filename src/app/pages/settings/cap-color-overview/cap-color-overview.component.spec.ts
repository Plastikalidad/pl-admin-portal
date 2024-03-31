import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapColorOverviewComponent } from './cap-color-overview.component';

describe('CapColorOverviewComponent', () => {
  let component: CapColorOverviewComponent;
  let fixture: ComponentFixture<CapColorOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapColorOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CapColorOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
