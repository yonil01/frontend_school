import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterCrudComponent } from './parameter-crud.component';

describe('ParameterCrudComponent', () => {
  let component: ParameterCrudComponent;
  let fixture: ComponentFixture<ParameterCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParameterCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
