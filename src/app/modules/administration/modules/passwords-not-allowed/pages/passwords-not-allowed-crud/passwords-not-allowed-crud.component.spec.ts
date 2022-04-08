import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordsNotAllowedCrudComponent } from './passwords-not-allowed-crud.component';

describe('PasswordsNotAllowedCrudComponent', () => {
  let component: PasswordsNotAllowedCrudComponent;
  let fixture: ComponentFixture<PasswordsNotAllowedCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordsNotAllowedCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordsNotAllowedCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
