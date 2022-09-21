import { TestBed } from '@angular/core/testing';

import { FormlyFunctionsService } from './formly-functions.service';

describe('FormlyFunctionsService', () => {
  let service: FormlyFunctionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormlyFunctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
