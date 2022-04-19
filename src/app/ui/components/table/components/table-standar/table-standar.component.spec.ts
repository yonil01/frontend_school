import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableStandarComponent } from './table-standar.component';

describe('TableStandarComponent', () => {
  let component: TableStandarComponent;
  let fixture: ComponentFixture<TableStandarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableStandarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableStandarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
