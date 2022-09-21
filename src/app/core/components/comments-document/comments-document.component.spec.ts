import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsDocumentComponent } from './comments-document.component';

describe('CommentsDocumentComponent', () => {
  let component: CommentsDocumentComponent;
  let fixture: ComponentFixture<CommentsDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentsDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
