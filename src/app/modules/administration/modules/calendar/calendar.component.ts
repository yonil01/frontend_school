import {Component, Input, OnInit} from '@angular/core';
import {TableModel} from "@app/ui/components/table/model/table.model";
import {StatusPage, styleTableCalendar} from "@app/modules/administration/modules/calendar/models/calendary.model";
import {showStatusPage} from "@app/modules/administration/modules/calendar/models/calendar.constans";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {ToastService} from "ecapture-ng-ui";
import {Subscription} from "rxjs/internal/Subscription";
import {CalendarService} from "@app/modules/administration/services/calendar/calendar.service";
import {Calendar} from "@app/core/models/config/calendar";
import {DatePipe} from "@angular/common";
import {Response, Role} from "@app/core/models";
import {deleteRole} from "@app/core/store/actions/roles.action";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  styleTableCalendar: TableModel = styleTableCalendar;
  public statusChangePage: StatusPage[] = showStatusPage;
  public toastStyle: ToastStyleModel = toastDataStyle;
  private _subscription: Subscription = new Subscription();
  public isBlockPage: boolean = false;
  public calendar: Calendar = {};
  public showConfirmDelete: boolean = false;
  public calendarSelected: Calendar = {};

  constructor(private _messageService: ToastService,
              private _calendarService: CalendarService,
              private datePipe: DatePipe,
              ) { }

  ngOnInit(): void {
      this.getCalendars();
  }

  public eventTableOption(resp:any): void {
    if (resp.type === 'setting') {
      this.calendar = resp.value;
      this.changePageStatus(2);
    }
    if (resp.type === 'edit') {
      this.calendar = resp.value;
      this.changePageStatus(1);
    } if (resp.type === 'delete') {
      this.deleteCalendar(resp.value);
    }
  }

  public addToastAlert(data:any): void {
    this._messageService.add({
      type: data.type,
      message: data.message,
      life: data.life,
    });
  }

  public changePageStatus(index: number): void {
    this.statusChangePage.forEach((data: StatusPage, i: number)=>{
      if (index === i) data.show = true
      else data.show = false
    })
  }

  public getCalendars(): void {
    this.isBlockPage = true;
    this.styleTableCalendar.dataSource=[];
    this._subscription.add(
      this._calendarService.getCalendars().subscribe({
        next: (res) => {
          if (res.error) {
            this._messageService.add({
              type: 'error',
              message: res.msg,
              life: 5000,
            })
            this.isBlockPage = false;
          } else {
            if (res.data.length) {
              res.data.forEach((data: Calendar)=>{
                const newData = {
                  value: data,
                  value1: data.name,
                  value2: String(this.datePipe.transform(data.start_date, 'yyyy-MM-dd hh:mm:ss')),
                  value3: String(this.datePipe.transform(data.end_date, 'yyyy-MM-dd hh:mm:ss')),
                }
                this.styleTableCalendar.dataSource?.push(newData);
              })
            }
            this.isBlockPage = false;
          }
        },
        error: (err: Error) => {
          this._messageService.add({
            type: 'error',
            message: ''+err,
            life: 5000,
          })
        }
      })
    );
  }

  public deleteCalendar(data: Calendar): void {
    this.calendarSelected = data;
    this.isBlockPage = true;
    this.showConfirmDelete = true;
  }

  confirmDialogDelete(event: boolean) {
    this.showConfirmDelete = false;
    this.isBlockPage = true;
    if (event) {
      this._subscription.add(
        this._calendarService.deleteCalendar(this.calendarSelected.id!).subscribe({
          next: (res) => {
            if (res.error) {
              this.isBlockPage = false;
              this._messageService.add({
                type: 'error',
                message: res.msg,
                life: 5000,
              })
              this.isBlockPage = false;
            } else {
              this._messageService.add({
                type: 'success',
                message: res.msg,
                life: 5000,
              })
              const index= this.styleTableCalendar.dataSource?.findIndex((item:any)=>item.value.id===this.calendarSelected.id);
              this.styleTableCalendar.dataSource?.splice(index!, 1);
              this.isBlockPage = false;
            }
          },
          error: (err: Error) => {
            this.isBlockPage = false;
            this._messageService.add({
              type: 'error',
              message: ''+err,
              life: 5000,
            })
          }
        })
      );
    } else {
      this.isBlockPage = false;
    }
  }
}
