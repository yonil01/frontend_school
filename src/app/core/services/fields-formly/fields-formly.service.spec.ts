import { TestBed } from '@angular/core/testing';

import { FieldsFormlyService } from './fields-formly.service';

describe('FieldsFormlyService', () => {
  let service: FieldsFormlyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FieldsFormlyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
