import { Component, OnInit } from '@angular/core';
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {TableModel} from "@app/ui/components/table/model/table.model";
import {styleTableTimer} from "@app/modules/administration/modules/timer/models/timer.constans";
import {ToastService} from "ecapture-ng-ui";
import {Subscription} from "rxjs/internal/Subscription";
import {TimerService} from "@app/modules/administration/services/timer/timer.service";
import {Timer, User} from "@app/core/models";
import {DatePipe} from "@angular/common";
import {NotificationModel} from "@app/core/models/config/notification";

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  public styleTableTimer: TableModel = styleTableTimer;
  public toastStyle: ToastStyleModel = toastDataStyle;
  public isShowCreate: boolean;
  private _subscription: Subscription = new Subscription();
  public isBlockPage: boolean = false;
  public timer: Timer = {};
  public timers: Timer[] = [];
  public dateMax = new Date();

  public showConfirmDelete: boolean = false;
  public timerSelected: Timer = {};

  constructor(private _messageService: ToastService,
              private datePipe: DatePipe,
              private _timerService: TimerService) {
    this.isShowCreate = false;
  }

  ngOnInit(): void {
    this.getTimers();
  }

  public eventDataReturn(data: any):void {
    if (data.type === 'delete') {
      this.deleteTimer(data.value);
    }
    if (data.type === 'edit') {
      this.timer = data.value;
      this.isShowCreate = true;
    }
  }

  public getTimers(): void {
    this.isBlockPage = true;
    this.styleTableTimer.dataSource = [];
    this._subscription.add(
      this._timerService.getTimers().subscribe({
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
            if (res.data.length) {
              res.data.forEach((data: Timer)=> {
                const newData: any = {
                  value: data,
                  value1: data.name,
                  value2: data.type,
                  value3: data.frequency,
                  value4: data.day_of_week,
                  value5: data.day_of_month,
                  value6: String(this.datePipe.transform(data.begin_at, 'yyyy-MM-dd hh:mm:ss')),
                  value7: String(this.datePipe.transform(data.end_at, 'yyyy-MM-dd hh:mm:ss')),
                }
                this.styleTableTimer.dataSource?.push(newData);
              })
              this.getCreateAtMax();
            }
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
  }

  public showToast(data: any): void {
    this._messageService.add(data);
  }

  public getCreateAtMax() {
    const arrayTimer = this.styleTableTimer.dataSource?.map((data: any) => new Date(data.value.created_at));
    // @ts-ignore
    this.dateMax = new Date(Math.max(...arrayTimer));
  }

  public deleteTimer(data: Timer): void {
    this.timerSelected = data;
    this.isBlockPage = true;
    this.showConfirmDelete = true;
  }

  confirmDialogDelete(event: boolean) {
    this.showConfirmDelete = false;
    this.isBlockPage = true;
    if (event) {
      this._subscription.add(
        this._timerService.deleteAns(this.timerSelected.id!).subscribe({
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
              this.getTimers();
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
