import { TestBed } from '@angular/core/testing';
import {PersonalsService} from "@app/modules/administration/services/Personal/Personals.service";


describe('PersonalsService', () => {
  let service: PersonalsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonalsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
