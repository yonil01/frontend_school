import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocEntityComponent } from './doc-entity.component';

describe('DocEntityComponent', () => {
  let component: DocEntityComponent;
  let fixture: ComponentFixture<DocEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
