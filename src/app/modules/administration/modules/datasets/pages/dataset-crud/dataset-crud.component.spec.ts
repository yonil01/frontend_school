import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetCrudComponent } from './dataset-crud.component';

describe('DatasetCrudComponent', () => {
  let component: DatasetCrudComponent;
  let fixture: ComponentFixture<DatasetCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatasetCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
