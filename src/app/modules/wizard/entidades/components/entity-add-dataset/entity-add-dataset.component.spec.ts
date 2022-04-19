import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityAddDatasetComponent } from './entity-add-dataset.component';

describe('EntityAddDatasetComponent', () => {
  let component: EntityAddDatasetComponent;
  let fixture: ComponentFixture<EntityAddDatasetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityAddDatasetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityAddDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
