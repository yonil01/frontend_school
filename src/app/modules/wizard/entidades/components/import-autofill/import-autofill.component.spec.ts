import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportAutofillComponent } from './import-autofill.component';

describe('ImportAutofillComponent', () => {
  let component: ImportAutofillComponent;
  let fixture: ComponentFixture<ImportAutofillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportAutofillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportAutofillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
