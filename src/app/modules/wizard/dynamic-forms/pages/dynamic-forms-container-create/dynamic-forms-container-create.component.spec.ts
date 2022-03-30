import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormsContainerCreateComponent } from './dynamic-forms-container-create.component';

describe('DynamicFormsContainerCreateComponent', () => {
  let component: DynamicFormsContainerCreateComponent;
  let fixture: ComponentFixture<DynamicFormsContainerCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicFormsContainerCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormsContainerCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
