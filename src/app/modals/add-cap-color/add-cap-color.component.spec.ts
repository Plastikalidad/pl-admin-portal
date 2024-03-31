import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCapColorComponent } from './add-cap-color.component';

describe('AddCapColorComponent', () => {
  let component: AddCapColorComponent;
  let fixture: ComponentFixture<AddCapColorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCapColorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCapColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
