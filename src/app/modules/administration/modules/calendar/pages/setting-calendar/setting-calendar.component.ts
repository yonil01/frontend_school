import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Calendar} from "@app/core/models/config/calendar";
import {DataDrop, DropdownModel} from "ecapture-ng-ui/lib/modules/dropdown/models/dropdown";
import {
  dataWeek, Days,
  dropStyle, Month,
  styleSelectList
} from "@app/modules/administration/modules/calendar/models/calendar.constans";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DatePipe} from "@angular/common";
import {ItemSelectList} from "@app/ui/components/list-select/models/list-select.model";
import {v4 as uuidv4} from 'uuid';
import {
  CalendarHolidays,
  CalendarWorkingDayWeek
} from "@app/modules/administration/modules/calendar/models/calendary.model";
import {Subscription} from "rxjs/internal/Subscription";
import {CalendarService} from "@app/modules/administration/services/calendar/calendar.service";

@Component({
  selector: 'app-setting-calendar',
  templateUrl: './setting-calendar.component.html',
  styleUrls: ['./setting-calendar.component.scss']
})
export class SettingCalendarComponent implements OnInit {
  @Input() calendar: Calendar = {};
  @Output() showToast = new EventEmitter<any>();
  @Output() showEventSetting = new EventEmitter<boolean>();
  private _subscription: Subscription = new Subscription();
  public readonly dropStyle: DropdownModel = dropStyle;
  public dataWeek: DataDrop[] = dataWeek;
  public formWorkingDaysWeek: FormGroup;
  public dataStyleList: ItemSelectList[] = styleSelectList;
  public isEdit: boolean = false;
  public isBlockPage: boolean = false;
  public idCalendarWorkingDayWeek: string = '';
  public idCalendarHoliday: string = '';
  public indexItemActive: number;
  public formCalendarHoliday: FormGroup;
  public arrayDays = Days;
  constructor(private _formBuilder: FormBuilder,
              private datePipe: DatePipe,
              private _calendarService: CalendarService,) {
    this.formWorkingDaysWeek = this._formBuilder.group({
      name: ['', [Validators.required]],
      start_day: ['', [Validators.required]],
      start_time: ['', [Validators.required]],
      end_time: ['', [Validators.required]],
    });
    this.indexItemActive = 0;
    this.formCalendarHoliday = this._formBuilder.group({
      name: ['', [Validators.required]],
      holiday_date: ['', [Validators.required]],
      start_time: ['', [Validators.required]],
      end_time: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.calendar.calendar_working_days_weeks) {
        this.calendar.calendar_working_days_weeks.forEach((data:CalendarWorkingDayWeek)=>{
          const newItem:any = {
            value: data,
            value1: data.name,
            value2: Days[data.day_number]+ ' ' +this.datePipe.transform(data.start_time,'shortTime'),
            value3: Days[data.day_number]+ ' ' +this.datePipe.transform(data.end_time,'shortTime'),
            status: {
              value: false,
            },
          }
          this.dataStyleList[0].dataSource?.push(newItem);
        })
    }

    if (this.calendar.calendar_holidays) {
      this.calendar.calendar_holidays.forEach((data:CalendarHolidays)=>{
        const newItem:any = {
          value: data,
          value1: data.name,
          value2: this.datePipe.transform(data.holiday_date,'shortDate'),
          value3: this.datePipe.transform(data.start_time,'shortTime'),
          value4: this.datePipe.transform(data.end_time,'shortTime'),
          value5: data.status_holiday_id,
          status: {
            value: false,
          },
        }
        this.dataStyleList[1].dataSource?.push(newItem);
      })
    }

  }

  public getStructDate(date: string): string {
    if (date) {
      return  Days[new Date(date).getDay()] + ' ' + new Date(date).getDate()+1 + ' de ' + Month[new Date(date).getDay()] + ' ' + new Date(date).getFullYear() +' '+ this.datePipe.transform(date, 'mediumTime');
    }
    return '';
  }

  public restDateReturnDays(dateOne: string, dateTwo: string): number {
    const startDate = new Date(dateOne).getTime();
    const endDate    = new Date(dateTwo).getTime();

    const diff = startDate - endDate;
    return  diff/(1000*60*60*24)
  }

  public backEvent(): void {
     this.showEventSetting.emit(true);
  }

  public returnDateISOS(time: string): string {
    const newDate = new Date(this.datePipe.transform(new Date(), 'mediumDate')+' '+ time);
    return newDate.toISOString();
  }

  public saveFormCalendarDayWeek():void {
    if (this.formWorkingDaysWeek.valid) {
      this.isBlockPage = true;
      const newData:CalendarWorkingDayWeek = {
        id: this.isEdit?this.idCalendarWorkingDayWeek:uuidv4().toLowerCase(),
        name: this.formWorkingDaysWeek.get('name')?.value,
        start_time: this.returnDateISOS(this.formWorkingDaysWeek.get('start_time')?.value),
        end_time: this.returnDateISOS(this.formWorkingDaysWeek.get('end_time')?.value),
        day_number: Number(this.formCalendarHoliday.get('start_day')),
        calendar_id: this.calendar.id!
      }
      if (this.isEdit) {
        this._subscription.add(
          this._calendarService.updateCalendarWorkingDaysWeeks(newData).subscribe({
            next: (res) => {
              if (res.error) {
                this.addToast({
                  type: 'error',
                  message: res.msg,
                  life: 5000,
                })
                this.isBlockPage = false;
              } else {
                if (res.data) {
                  const newItem:any = {
                    value: res.data,
                    value1: res.data.name,
                    value2: Days[res.data.day_number]+ ' ' +this.datePipe.transform(res.data.start_time,'shortTime'),
                    value3: Days[res.data.day_number]+ ' ' +this.datePipe.transform(res.data.end_time,'shortTime'),
                    status: {
                      value: false,
                    },
                  }
                  const index = this.dataStyleList[0].dataSource?.findIndex((item:any)=>item.value.id===this.idCalendarWorkingDayWeek);
                  // @ts-ignore
                  this.dataStyleList[0].dataSource[index] = newItem;
                }
                this.addToast({
                  type: 'success',
                  message: res.msg,
                  life: 5000,
                })
                this.isBlockPage = false;
              }
            },
            error: (err: Error) => {
              this.addToast({
                type: 'error',
                message: err,
                life: 5000,
              })
            }
          })
        );
      } else {
        this._subscription.add(
          this._calendarService.createCalendarWorkingDaysWeeks(newData).subscribe({
            next: (res) => {
              if (res.error) {
                this.addToast({
                  type: 'error',
                  message: res.msg,
                  life: 5000,
                })
                this.isBlockPage = false;
              } else {
                const newItem:any = {
                  value: res.data,
                  value1: res.data.name,
                  value2: Days[res.data.day_number]+ ' ' +this.datePipe.transform(res.data.start_time,'shortTime'),
                  value3: Days[res.data.day_number]+ ' ' +this.datePipe.transform(res.data.end_time,'shortTime'),
                  status: {
                    value: false,
                  },
                }
                this.dataStyleList[0].dataSource?.push(newItem);
                this.formWorkingDaysWeek.reset();
                this.addToast({
                  type: 'success',
                  message: res.msg,
                  life: 5000,
                })
                this.isBlockPage = false;
              }
            },
            error: (err: Error) => {
              this.addToast({
                type: 'error',
                message: err,
                life: 5000,
              })
            }
          })
        );
      }
    }
  }

  public addToast(data: any): void {
    this.showToast.emit({type: data.type, message: data.message, life: data.life});
  }

  public deleteCalendarWorkingDaysWeeks(data: CalendarWorkingDayWeek):void {
    this.isBlockPage = true;
    this._subscription.add(
      this._calendarService.deleteCalendarWorkingDaysWeeks(data.id!).subscribe({
        next: (res) => {
          if (res.error) {
            this.isBlockPage = false;
            this.addToast({
              type: 'error',
              message: res.msg,
              life: 5000,
            })
            this.isBlockPage = false;
          } else {
            this.addToast({
              type: 'success',
              message: res.msg,
              life: 5000,
            })
            const index= this.dataStyleList[0].dataSource?.findIndex((item:any)=>item.value.id===data.id);
            this.dataStyleList[0].dataSource?.splice(index!, 1);
            this.isBlockPage = false;
          }
        },
        error: (err: Error) => {
          this.isBlockPage = false;
          this.addToast({
            type: 'error',
            message: ''+err,
            life: 5000,
          })
        }
      })
    )
  }

  public eventTableOption(resp:any): void {
     if (resp.type === 'delete') {
      if (!this.indexItemActive) {
        this.deleteCalendarWorkingDaysWeeks(resp.value)
      } else {
        this.deleteCalendarHoliday(resp.value);
      }
    }
     if (resp.type === 'edit') {
         this.loadDateInForm(resp.value);

     }
     if (resp.type === 'change-status') {
       this.indexItemActive = resp.value;
     }
  }

  public deleteCalendarHoliday(calendarHoliday: CalendarHolidays): void {
    this.isBlockPage = true;
    this._subscription.add(
      this._calendarService.deleteCalendarHoliday(calendarHoliday.id!).subscribe({
        next: (res) => {
          if (res.error) {
            this.isBlockPage = false;
            this.addToast({
              type: 'error',
              message: res.msg,
              life: 5000,
            })
            this.isBlockPage = false;
          } else {
            this.addToast({
              type: 'success',
              message: res.msg,
              life: 5000,
            })
            const index= this.dataStyleList[0].dataSource?.findIndex((item:any)=>item.value.id===calendarHoliday.id);
            this.dataStyleList[1].dataSource?.splice(index!, 1);
            this.isBlockPage = false;
          }
        },
        error: (err: Error) => {
          this.isBlockPage = false;
          this.addToast({
            type: 'error',
            message: ''+err,
            life: 5000,
          })
        }
      })
    )
  }

  public loadDateInForm(data: any): void {
    if (!this.indexItemActive) {
      this.idCalendarWorkingDayWeek = data.id;
      this.formWorkingDaysWeek.get('name')?.setValue(data.name);
      this.formWorkingDaysWeek.get('start_day')?.setValue(data.day_number);
      this.formWorkingDaysWeek.get('start_time')?.setValue(this.datePipe.transform(data.start_time, 'shortTime'));
      this.formWorkingDaysWeek.get('end_time')?.setValue(this.datePipe.transform(data.end_time, 'shortTime'));
    } else {
      this.idCalendarHoliday = data.id;
      this.formCalendarHoliday.get('name')?.setValue(data.name);
      this.formCalendarHoliday.get('holiday_date')?.setValue(data.holiday_date);
      this.formCalendarHoliday.get('start_time')?.setValue(this.datePipe.transform(data.start_time, 'shortTime'));
      this.formCalendarHoliday.get('end_time')?.setValue(this.datePipe.transform(data.end_time, 'shortTime'));
    }
    this.isEdit = true;
  }

  public saveFormCalendarHoliday(): void {
    if (this.formCalendarHoliday.valid) {
      this.isBlockPage = true;
      const newData:CalendarHolidays = {
        id: this.isEdit?this.idCalendarHoliday:uuidv4().toLowerCase(),
        name: this.formCalendarHoliday.get('name')?.value,
        holiday_date: this.formCalendarHoliday.get('holiday_date')?.value,
        start_time: this.returnDateISOS(this.formCalendarHoliday.get('start_time')?.value),
        end_time: this.returnDateISOS(this.formCalendarHoliday.get('end_time')?.value),
        status_holiday_id: 1,
        calendar_id: this.calendar.id!
      }
      if (this.isEdit) {
        this._subscription.add(
          this._calendarService.updateCalendarHoliday(newData).subscribe({
            next: (res) => {
              if (res.error) {
                this.addToast({
                  type: 'error',
                  message: res.msg,
                  life: 5000,
                })
                this.isBlockPage = false;
              } else {
                if (res.data) {
                  const newItem:any = {
                    value: res.data,
                    value1: res.data.name,
                    value2: this.datePipe.transform(res.data.holiday_date,'shortDate'),
                    value3: this.datePipe.transform(res.data.start_time,'shortTime'),
                    value4: this.datePipe.transform(res.data.end_time,'shortTime'),
                    value5: res.data.status_holiday_id,
                    status: {
                      value: false,
                    },
                  }
                  const index = this.dataStyleList[1].dataSource?.findIndex((item:any)=>item.value.id===this.idCalendarHoliday);
                  // @ts-ignore
                  this.dataStyleList[1].dataSource[index] = newItem;
                }
                this.addToast({
                  type: 'success',
                  message: res.msg,
                  life: 5000,
                })
                this.isBlockPage = false;
              }
            },
            error: (err: Error) => {
              this.addToast({
                type: 'error',
                message: err,
                life: 5000,
              })
            }
          })
        );
      } else {
        this._subscription.add(
          this._calendarService.createCalendarHoliday(newData).subscribe({
            next: (res) => {
              if (res.error) {
                this.addToast({
                  type: 'error',
                  message: res.msg,
                  life: 5000,
                })
                this.isBlockPage = false;
              } else {
                const newItem:any = {
                  value: res.data,
                  value1: res.data.name,
                  value2: this.datePipe.transform(res.data.holiday_date,'shortDate'),
                  value3: this.datePipe.transform(res.data.start_time,'shortTime'),
                  value4: this.datePipe.transform(res.data.end_time,'shortTime'),
                  value5: res.data.status_holiday_id,
                  status: {
                    value: false,
                  },
                }
                this.dataStyleList[1].dataSource?.push(newItem);
                this.formCalendarHoliday.reset();
                this.addToast({
                  type: 'success',
                  message: res.msg,
                  life: 5000,
                })
                this.isBlockPage = false;
              }
            },
            error: (err: Error) => {
              this.addToast({
                type: 'error',
                message: err,
                life: 5000,
              })
            }
          })
        );
      }
    }
  }

}
