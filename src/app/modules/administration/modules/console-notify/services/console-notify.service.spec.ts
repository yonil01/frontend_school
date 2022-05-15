import { TestBed } from '@angular/core/testing';

import { ConsoleNotifyService } from './console-notify.service';

describe('ConsoleNotifyService', () => {
  let service: ConsoleNotifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsoleNotifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
