import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomCrudComponent } from './classroom-crud.component';

describe('ClassroomCrudComponent', () => {
  let component: ClassroomCrudComponent;
  let fixture: ComponentFixture<ClassroomCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassroomCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassroomCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
