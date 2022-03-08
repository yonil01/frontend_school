import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntitiesCreateEditComponent } from './entities-create-edit.component';

describe('EntitiesCreateEditComponent', () => {
  let component: EntitiesCreateEditComponent;
  let fixture: ComponentFixture<EntitiesCreateEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntitiesCreateEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntitiesCreateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
