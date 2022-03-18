import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityAddValuesComponent } from './entity-add-values.component';

describe('EntityAddValuesComponent', () => {
  let component: EntityAddValuesComponent;
  let fixture: ComponentFixture<EntityAddValuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityAddValuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityAddValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
