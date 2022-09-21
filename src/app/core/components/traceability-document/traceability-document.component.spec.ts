import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceabilityDocumentComponent } from './traceability-document.component';

describe('TraceabilityDocumentComponent', () => {
  let component: TraceabilityDocumentComponent;
  let fixture: ComponentFixture<TraceabilityDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraceabilityDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraceabilityDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
