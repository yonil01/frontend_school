import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Calendar} from "@app/core/models/config/calendar";

@Component({
  selector: 'app-setting-calendar',
  templateUrl: './setting-calendar.component.html',
  styleUrls: ['./setting-calendar.component.scss']
})
export class SettingCalendarComponent implements OnInit {
  @Input() calendar: Calendar = {};
  @Output() showEventSetting = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit(): void {

  }

  public backEvent(): void {
     this.showEventSetting.emit(true);
  }

}
