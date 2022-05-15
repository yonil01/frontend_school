import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoleNotifyComponent } from './console-notify.component';

describe('ConsoleNotifyComponent', () => {
  let component: ConsoleNotifyComponent;
  let fixture: ComponentFixture<ConsoleNotifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsoleNotifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsoleNotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
