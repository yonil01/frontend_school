import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordsNotAllowedListComponent } from './passwords-not-allowed-list.component';

describe('PasswordsNotAllowedListComponent', () => {
  let component: PasswordsNotAllowedListComponent;
  let fixture: ComponentFixture<PasswordsNotAllowedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordsNotAllowedListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordsNotAllowedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
