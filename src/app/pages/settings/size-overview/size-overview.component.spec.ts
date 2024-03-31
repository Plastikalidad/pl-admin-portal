import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SizeOverviewComponent } from './size-overview.component';

describe('SizeOverviewComponent', () => {
  let component: SizeOverviewComponent;
  let fixture: ComponentFixture<SizeOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SizeOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SizeOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
