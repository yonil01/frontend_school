import { TestBed } from '@angular/core/testing';
import {SubjectsService} from "@app/modules/administration/services/subject/subjects.service";


describe('SubjectsService', () => {
  let service: SubjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubjectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
