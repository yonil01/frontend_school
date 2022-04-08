import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetConfigCreateEditComponent } from './dataset-config-create-edit.component';

describe('DatasetConfigCreateEditComponent', () => {
  let component: DatasetConfigCreateEditComponent;
  let fixture: ComponentFixture<DatasetConfigCreateEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatasetConfigCreateEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetConfigCreateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
