import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesSecurityPoliticComponent } from './roles-security-politic.component';

describe('RolesSecurityPoliticComponent', () => {
  let component: RolesSecurityPoliticComponent;
  let fixture: ComponentFixture<RolesSecurityPoliticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolesSecurityPoliticComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesSecurityPoliticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
