import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordsNotAllowedComponent } from './passwords-not-allowed.component';

describe('PasswordsNotAllowedComponent', () => {
  let component: PasswordsNotAllowedComponent;
  let fixture: ComponentFixture<PasswordsNotAllowedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordsNotAllowedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordsNotAllowedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
