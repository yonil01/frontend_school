import { TestBed } from '@angular/core/testing';

import { DocTypeGroupsService } from './doc-type-groups.service';

describe('DocTypeGroupsService', () => {
  let service: DocTypeGroupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocTypeGroupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
