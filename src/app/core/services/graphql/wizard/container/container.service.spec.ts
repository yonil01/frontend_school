import { TestBed } from '@angular/core/testing';

import { ContainerService } from './container.service';

describe('CustomerService', () => {
  let service: ContainerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContainerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
