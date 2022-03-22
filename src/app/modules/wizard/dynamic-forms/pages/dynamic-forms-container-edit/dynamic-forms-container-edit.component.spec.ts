import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormsContainerEditComponent } from './dynamic-forms-container-edit.component';

describe('DynamicFormsContainerEditComponent', () => {
  let component: DynamicFormsContainerEditComponent;
  let fixture: ComponentFixture<DynamicFormsContainerEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicFormsContainerEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormsContainerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
