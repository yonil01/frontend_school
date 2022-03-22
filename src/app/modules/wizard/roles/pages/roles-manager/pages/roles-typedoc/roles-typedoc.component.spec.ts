import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesTypedocComponent } from './roles-typedoc.component';

describe('RolesTypedocComponent', () => {
  let component: RolesTypedocComponent;
  let fixture: ComponentFixture<RolesTypedocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolesTypedocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesTypedocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
