import { TestBed } from '@angular/core/testing';
import {ClassroomsService} from "@app/modules/administration/services/Classroom/Classrooms.service";


describe('ClassroomsService', () => {
  let service: ClassroomsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassroomsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
