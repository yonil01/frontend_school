import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntitiesCreateEditAutofillsComponent } from './entities-create-edit-autofills.component';

describe('EntitiesCreateEditAutofillsComponent', () => {
  let component: EntitiesCreateEditAutofillsComponent;
  let fixture: ComponentFixture<EntitiesCreateEditAutofillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntitiesCreateEditAutofillsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntitiesCreateEditAutofillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
