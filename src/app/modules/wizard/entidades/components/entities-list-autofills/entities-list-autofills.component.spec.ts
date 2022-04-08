import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntitiesListAutofillsComponent } from './entities-list-autofills.component';

describe('EntitiesListAutofillsComponent', () => {
  let component: EntitiesListAutofillsComponent;
  let fixture: ComponentFixture<EntitiesListAutofillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntitiesListAutofillsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntitiesListAutofillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
