import { TestBed } from '@angular/core/testing';

import { AnnexeService } from './annexe.service';

describe('AnnexeService', () => {
  let service: AnnexeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnnexeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
