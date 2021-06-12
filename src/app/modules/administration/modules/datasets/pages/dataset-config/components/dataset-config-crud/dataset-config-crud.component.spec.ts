import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetConfigCrudComponent } from './dataset-config-crud.component';

describe('DatasetConfigCrudComponent', () => {
  let component: DatasetConfigCrudComponent;
  let fixture: ComponentFixture<DatasetConfigCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatasetConfigCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetConfigCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
