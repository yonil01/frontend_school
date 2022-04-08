import { TestBed } from '@angular/core/testing';

import { LookAndFeelService } from './look-and-feel.service';

describe('LookAndFeelService', () => {
  let service: LookAndFeelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LookAndFeelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
