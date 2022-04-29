import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Calendar} from "@app/core/models/config/calendar";
import {DataDrop, DropdownModel} from "ecapture-ng-ui/lib/modules/dropdown/models/dropdown";
import {
  dataWeek,
  dropStyle,
  styleSelectList
} from "@app/modules/administration/modules/calendar/models/calendar.constans";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DatePipe} from "@angular/common";
import {ItemSelectList} from "@app/ui/components/list-select/models/list-select.model";
import {v4 as uuidv4} from 'uuid';
import {CalendarWorkingDayWeek} from "@app/modules/administration/modules/calendar/models/calendary.model";

@Component({
  selector: 'app-setting-calendar',
  templateUrl: './setting-calendar.component.html',
  styleUrls: ['./setting-calendar.component.scss']
})
export class SettingCalendarComponent implements OnInit {
  @Input() calendar: Calendar = {};
  @Output() showEventSetting = new EventEmitter<boolean>();
  public readonly dropStyle: DropdownModel = dropStyle;
  public dataWeek: DataDrop[] = dataWeek;
  public formWorkingDaysWeek: FormGroup;
  public dataStyleList: ItemSelectList[] = styleSelectList;
  constructor(private _formBuilder: FormBuilder,  private datePipe: DatePipe) {
    this.formWorkingDaysWeek = this._formBuilder.group({
      start_day: ['', [Validators.required]],
      start_time: ['', [Validators.required]],
      end_day: ['', [Validators.required]],
      end_time: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
  }

  public backEvent(): void {
     this.showEventSetting.emit(true);
  }

  public saveForm():void {
    /*if (this.formWorkingDaysWeek.valid) {
      const newData:CalendarWorkingDayWeek = {
        id: uuidv4().toLowerCase(),
        name: this.formWorkingDaysWeek.get('name')?.value,
        start_time: this.formWorkingDaysWeek.get('start_time')?.value,
        end_time: this.formWorkingDaysWeek.get('end_time')?.value,
        day_number: 6,
        calendar_id:
      }
    }*/
  }

}
