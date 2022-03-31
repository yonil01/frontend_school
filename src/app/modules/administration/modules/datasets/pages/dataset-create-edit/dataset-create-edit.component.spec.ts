import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetCreateEditComponent } from './dataset-create-edit.component';

describe('DatasetCreateEditComponent', () => {
  let component: DatasetCreateEditComponent;
  let fixture: ComponentFixture<DatasetCreateEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatasetCreateEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetCreateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
