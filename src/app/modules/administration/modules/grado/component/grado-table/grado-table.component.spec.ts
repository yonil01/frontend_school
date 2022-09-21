import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GradoTableComponent } from './grado-table.component';

describe('GradoTableComponent', () => {
  let component: GradoTableComponent;
  let fixture: ComponentFixture<GradoTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GradoTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GradoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
