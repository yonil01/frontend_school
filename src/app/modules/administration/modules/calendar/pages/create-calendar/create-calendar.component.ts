import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TableModel} from "@app/ui/components/table/model/table.model";
import {
  styleTableCalendar
} from "@app/modules/administration/modules/calendar/models/calendary.model";
import {v4 as uuidv4} from 'uuid';
import {Subscription} from "rxjs/internal/Subscription";
import {CalendarService} from "@app/modules/administration/services/calendar/calendar.service";
import {Calendar} from "@app/core/models/config/calendar";
import {Timer} from "@app/core/models";


@Component({
  selector: 'app-create-calendar',
  templateUrl: './create-calendar.component.html',
  styleUrls: ['./create-calendar.component.scss']
})
export class CreateCalendarComponent implements OnInit {
  @Output() showToast = new EventEmitter<any>();
  @Output() showEventRegister = new EventEmitter<boolean>();
  public formCalendar: FormGroup;
  private _subscription: Subscription = new Subscription();
  public styleCalendar: TableModel = styleTableCalendar;
  public isEdit: boolean = false;
  @Input() calendar: Calendar = {};
  public isBlockPage: boolean = false;
  constructor(private _formBuilder: FormBuilder,
              private _calendarService: CalendarService,
              ) {
    this.formCalendar = this._formBuilder.group({
      name: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (Object.keys(this.calendar).length) {
      this.loadCalendar();
      this.isEdit = true;
    }
  }

  public loadCalendar(): void {
    this.formCalendar.get('name')?.setValue(this.calendar.name);
    this.formCalendar.get('start_date')?.setValue(this.calendar.start_date);
    this.formCalendar.get('end_date')?.setValue(this.calendar.end_date);
  }

  public saveForm(): void {
    if (this.formCalendar.valid) {
      this.isBlockPage = true;
      const newDate: Calendar = {
        id: this.isEdit?this.calendar.id:uuidv4().toLowerCase(),
        name: this.formCalendar.get('name')?.value,
        start_date: this.formCalendar.get('start_date')?.value,
        end_date: this.formCalendar.get('end_date')?.value,
      }

      if (this.isEdit) {
        this._subscription.add(
          this._calendarService.updateCalendar(newDate).subscribe({
            next: (res) => {
              if (res.error) {
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
                this.isBlockPage = false;
                this.showEventRegister.emit(false);
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
          this._calendarService.createCalendar(newDate).subscribe({
            next: (res) => {
              if (res.error) {
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
                this.isBlockPage = false;
                this.showEventRegister.emit(false)
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
}
