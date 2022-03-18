import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesDisabledDatesComponent } from './roles-disabled-dates.component';

describe('RolesDisabledDatesComponent', () => {
  let component: RolesDisabledDatesComponent;
  let fixture: ComponentFixture<RolesDisabledDatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolesDisabledDatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesDisabledDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
