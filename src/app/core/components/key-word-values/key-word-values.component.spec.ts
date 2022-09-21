import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyWordValuesComponent } from './key-word-values.component';

describe('KeyWordValuesComponent', () => {
  let component: KeyWordValuesComponent;
  let fixture: ComponentFixture<KeyWordValuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeyWordValuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyWordValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
