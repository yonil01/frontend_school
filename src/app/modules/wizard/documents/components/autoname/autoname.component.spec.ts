import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutonameComponent } from './autoname.component';

describe('AutonameComponent', () => {
  let component: AutonameComponent;
  let fixture: ComponentFixture<AutonameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutonameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutonameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
