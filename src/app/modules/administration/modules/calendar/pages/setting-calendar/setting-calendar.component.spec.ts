import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingCalendarComponent } from './setting-calendar.component';

describe('SettingCalendarComponent', () => {
  let component: SettingCalendarComponent;
  let fixture: ComponentFixture<SettingCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
