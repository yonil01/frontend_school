import { TestBed } from '@angular/core/testing';

import { SourceFileService } from './source-file.service';

describe('SourceFileService', () => {
  let service: SourceFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SourceFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
