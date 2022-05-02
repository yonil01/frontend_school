import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigAttributeRequeridComponent } from './config-attribute-requerid.component';

describe('ConfigAttributeRequeridComponent', () => {
  let component: ConfigAttributeRequeridComponent;
  let fixture: ComponentFixture<ConfigAttributeRequeridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigAttributeRequeridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigAttributeRequeridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
