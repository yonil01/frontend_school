import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {v4 as uuidv4} from 'uuid';
import {NotificationModel} from "@app/core/models/config/notification";
import {NotificationService} from "@app/modules/administration/services/notification/notification.service";
import {Subscription} from "rxjs/internal/Subscription";
import {Timer} from "@app/core/models";
import {Ans} from "@app/core/models/config/ans";

@Component({
  selector: 'app-create-notification',
  templateUrl: './create-notification.component.html',
  styleUrls: ['./create-notification.component.scss']
})
export class CreateNotificationComponent implements OnInit {
  @Output() showToast = new EventEmitter<any>();
  @Output() isShowCreate = new EventEmitter<boolean>();
  private _subscription: Subscription = new Subscription();
  public formNotification: FormGroup;
  public isBlockPage: boolean = false;
  public isEdit: boolean = false;
  @Input() timers: Timer[] = [];
  @Input() notification: NotificationModel = {};

  constructor(private _formBuilder: FormBuilder,
              private _notificationService: NotificationService,
              ) {
    this.formNotification = this._formBuilder.group({
      name: ['', [Validators.required]],
      email_from: ['', [Validators.required]],
      email_to: ['', [Validators.required]],
      subject_email: ['', [Validators.required]],
      template: ['', [Validators.required]],
      url_pop: ['', [Validators.required]],
      timer_id: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    if (Object.keys(this.notification).length) {
      this.loadNotification();
      this.isEdit = true;
    }
  }

  public loadNotification():void {
    this.formNotification.get('name')?.setValue(this.notification.name);
    this.formNotification.get('email_from')?.setValue(this.notification.email_from);
    this.formNotification.get('email_to')?.setValue(this.notification.email_to);
    this.formNotification.get('subject_email')?.setValue(this.notification.subject_email);
    this.formNotification.get('template')?.setValue(this.notification.template);
    this.formNotification.get('url_pop')?.setValue(this.notification.url_pop);
    this.formNotification.get('timer_id')?.setValue(this.notification.timer_id);
  }

  public saveForm():void {
    if (this.formNotification.valid) {
      this.isBlockPage = true;
        const newNotification: NotificationModel = {
          id: this.isEdit?this.notification.id:uuidv4().toLowerCase(),
          name: this.formNotification.get('name')?.value,
          email_from: this.formNotification.get('email_from')?.value,
          email_to: this.formNotification.get('email_to')?.value,
          subject_email: this.formNotification.get('subject_email')?.value,
          template: this.formNotification.get('template')?.value,
          url_pop: this.formNotification.get('url_pop')?.value,
          timer_id: this.formNotification.get('timer_id')?.value,
      }
      if (this.isEdit) {
        this._subscription.add(
          this._notificationService.updateNotification(newNotification).subscribe({
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
                this.isShowCreate.emit(false);
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
          this._notificationService.createNotification(newNotification).subscribe({
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
                this.isShowCreate.emit(false)
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

  public getQueue(): void {

  }

}
