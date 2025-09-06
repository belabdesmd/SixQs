import { TestBed } from '@angular/core/testing';

import { Summarizer } from './summarizer';

describe('Summarizer', () => {
  let service: Summarizer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Summarizer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
