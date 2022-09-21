import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfVisorComponent } from './pdf-visor.component';

describe('PdfVisorComponent', () => {
  let component: PdfVisorComponent;
  let fixture: ComponentFixture<PdfVisorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfVisorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfVisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
