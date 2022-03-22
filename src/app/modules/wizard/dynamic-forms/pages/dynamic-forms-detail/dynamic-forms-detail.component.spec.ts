import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormsDetailComponent } from './dynamic-forms-detail.component';

describe('DynamicFormsDetailComponent', () => {
  let component: DynamicFormsDetailComponent;
  let fixture: ComponentFixture<DynamicFormsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicFormsDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
