import { Component, OnInit } from '@angular/core';
import {TableModel} from "@app/ui/components/table/model/table.model";
import {styleTableNotification} from "@app/modules/administration/modules/notification/models/notification.model";
import {ToastService} from "ecapture-ng-ui";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {Subscription} from "rxjs/internal/Subscription";
import {NotificationService} from "@app/modules/administration/services/notification/notification.service";
import {NotificationModel} from "@app/core/models/config/notification";
import {TimersService} from "@app/core/services/graphql/config/timers/timers.service";
import {Timer} from "@app/core/models";
import {Calendar} from "@app/core/models/config/calendar";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  private _subscription: Subscription = new Subscription();
  public styleTableNotify: TableModel = styleTableNotification;
  public toastStyle: ToastStyleModel = toastDataStyle;
  public isShowCreate: boolean;
  public isBlockPage: boolean = false;
  public notification: NotificationModel = {};
  public dateMax = new Date();
  public timers: Timer[] = [];

  public showConfirmDelete: boolean = false;
  public notificationSelected: NotificationModel = {};

  constructor(private _messageService: ToastService,
              private _notificationService: NotificationService,
              private _timerService: TimersService
  ) {
    this.isShowCreate = false;
  }

  ngOnInit(): void {
    this.getTimers();
  }

  public showToast(data: any): void {
    this._messageService.add(data);
  }

  public eventDataReturn(data: any):void {
    if (data.type === 'delete') {
      this.deleteNotification(data.value);
    }
    if (data.type === 'edit') {
      this.notification = data.value;
      this.isShowCreate = true;
    }
  }

  public getNotifications(): void {
    this.isBlockPage = true;
    this.styleTableNotify.dataSource = [];
    this._subscription.add(
      this._notificationService.getNotifications().subscribe({
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

              res.data.forEach((data: NotificationModel) => {
                const newData: any = {
                  value: data,
                  value1: data.name,
                  value2: data.email_from,
                  value3: data.email_to,
                  value4: data.template,
                  value5: data.url_pop,
                  value6: String(this.timers.filter((item:Timer)=>item.id===data.timer_id).map((map:Timer)=>map.name)),
                  value7: data.subject_email
                }
                this.styleTableNotify.dataSource?.push(newData);
              });
              this.getCreateAtMax();
            }
            this.isBlockPage = false;
          }
        },
        error: (err: Error) => {
          this._messageService.add({
            type: 'error',
            message: 'Error contactese con el administrador!',
            life: 5000,
          })
        }
      })
    );
  }

  public getCreateAtMax() {
    const arrayTimer = this.styleTableNotify.dataSource?.map((data: any) => new Date(data.value.created_at));
    // @ts-ignore
    this.dateMax = new Date(Math.max(...arrayTimer));
  }

  public getTimers(): void {
    this._subscription.add(
      this._timerService.getTimers().subscribe(
        {
          next: (res) => {
            if (res.error) {
              this._messageService.add({message: res.msg, type: 'error', life: 5000});
            } else {
              if (res.data.length) {
                this.timers = res.data
                this.getNotifications();
              }
            }
          },
          error: (err: any) => {
            this._messageService.add({message: 'Error Cuando se trato de traer los ANS', type: 'error', life: 5000});
          }
        }
      )
    );
  }

  public deleteNotification(data: NotificationModel): void {
    this.notificationSelected = data;
    this.isBlockPage = true;
    this.showConfirmDelete = true;
  }

  confirmDialogDelete(event: boolean) {
    this.showConfirmDelete = false;
    this.isBlockPage = true;
    if (event) {
      this._subscription.add(
        this._notificationService.deleteNotification(this.notificationSelected.id!).subscribe({
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
