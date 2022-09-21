import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormExternalComponent } from './form-external.component';

describe('FormExternalComponent', () => {
  let component: FormExternalComponent;
  let fixture: ComponentFixture<FormExternalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormExternalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormExternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
