import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoverypwdComponent } from './recoverypwd.component';

describe('RecoverypwdComponent', () => {
  let component: RecoverypwdComponent;
  let fixture: ComponentFixture<RecoverypwdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecoverypwdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoverypwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
