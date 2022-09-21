import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalCrudComponent } from './personal-crud.component';

describe('PersonalCrudComponent', () => {
  let component: PersonalCrudComponent;
  let fixture: ComponentFixture<PersonalCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
