import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetConfigListComponent } from './dataset-config-list.component';

describe('DatasetConfigListComponent', () => {
  let component: DatasetConfigListComponent;
  let fixture: ComponentFixture<DatasetConfigListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatasetConfigListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetConfigListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
