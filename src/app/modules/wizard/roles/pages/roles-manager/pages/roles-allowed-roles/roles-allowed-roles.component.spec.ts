import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesAllowedRolesComponent } from './roles-allowed-roles.component';

describe('RolesAllowedRolesComponent', () => {
  let component: RolesAllowedRolesComponent;
  let fixture: ComponentFixture<RolesAllowedRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolesAllowedRolesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesAllowedRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
