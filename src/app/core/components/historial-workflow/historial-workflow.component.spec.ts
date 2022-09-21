import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialWorkflowComponent } from './historial-workflow.component';

describe('HistorialWorkflowComponent', () => {
  let component: HistorialWorkflowComponent;
  let fixture: ComponentFixture<HistorialWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorialWorkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
