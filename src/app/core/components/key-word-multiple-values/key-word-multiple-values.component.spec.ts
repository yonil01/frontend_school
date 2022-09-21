import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyWordMultipleValuesComponent } from './key-word-multiple-values.component';

describe('KeyWordMultipleValuesComponent', () => {
  let component: KeyWordMultipleValuesComponent;
  let fixture: ComponentFixture<KeyWordMultipleValuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeyWordMultipleValuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyWordMultipleValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
