import { TestBed } from '@angular/core/testing';
import {TeacherService} from "@app/modules/administration/services/user/Teacher.service";


describe('TeacherService', () => {
  let service: TeacherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
