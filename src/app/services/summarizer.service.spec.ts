import { TestBed } from '@angular/core/testing';

import { SummarizerService } from './summarizer.service';

describe('Summarizer', () => {
  let service: SummarizerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SummarizerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
