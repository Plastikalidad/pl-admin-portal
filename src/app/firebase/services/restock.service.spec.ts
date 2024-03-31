import { TestBed } from '@angular/core/testing';

import { RestockService } from './restock.service';

describe('RestockService', () => {
  let service: RestockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
