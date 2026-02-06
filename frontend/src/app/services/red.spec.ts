import { TestBed } from '@angular/core/testing';

import { Red } from './red';

describe('Red', () => {
  let service: Red;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Red);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
