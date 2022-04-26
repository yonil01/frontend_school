import { TestBed } from '@angular/core/testing';

import { PasswordNotAllowedService } from './password-not-allowed.service';

describe('PasswordNotAllowedService', () => {
  let service: PasswordNotAllowedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordNotAllowedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
