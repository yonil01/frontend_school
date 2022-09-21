import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutogestionComponent } from './autogestion.component';

describe('AutogestionComponent', () => {
  let component: AutogestionComponent;
  let fixture: ComponentFixture<AutogestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutogestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutogestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
