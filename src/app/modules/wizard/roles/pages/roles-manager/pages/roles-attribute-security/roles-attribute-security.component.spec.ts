import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesAttributeSecurityComponent } from './roles-attribute-security.component';

describe('RolesAttributeSecurityComponent', () => {
  let component: RolesAttributeSecurityComponent;
  let fixture: ComponentFixture<RolesAttributeSecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolesAttributeSecurityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesAttributeSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
