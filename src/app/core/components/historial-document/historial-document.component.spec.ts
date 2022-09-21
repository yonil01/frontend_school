import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialDocumentComponent } from './historial-document.component';

describe('HistorialDocumentComponent', () => {
  let component: HistorialDocumentComponent;
  let fixture: ComponentFixture<HistorialDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorialDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
