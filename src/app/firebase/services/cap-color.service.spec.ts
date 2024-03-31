import { TestBed } from '@angular/core/testing';

import { CapColorService } from './cap-color.service';

describe('CapColorService', () => {
  let service: CapColorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CapColorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
