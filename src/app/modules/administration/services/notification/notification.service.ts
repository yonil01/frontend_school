import { Injectable } from '@angular/core';
import {
  CreateNotification, DeleteNotification,
  GetNotifications, UpdateNotification
} from "@app/modules/administration/services/notification/notification.queries.service";
import {NewUserAttribute, Response, Timer} from "@app/core/models";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {NotificationModel} from "@app/core/models/config/notification";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private createModuleNotification: CreateNotification,
    private getModuleNotifications: GetNotifications,
    private deleteModuleNotification: DeleteNotification,
    private updateModuleNotification: UpdateNotification
  ) {

  }

  createNotification(notification: NotificationModel): Observable<Response> {
    return this.createModuleNotification
      .mutate({
        rq: {data: notification},
      })
      .pipe(map(({data}: any) => data.createNotification));
  }

  getNotifications(): Observable<Response> {
    return this.getModuleNotifications.watch().valueChanges.pipe(map(({data}: any) => data.getNotifications));
  }

  deleteNotification(id: string): Observable<Response> {
    return this.deleteModuleNotification
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => data.deleteNotification));
  }

  updateNotification(notification: NotificationModel): Observable<Response> {
    return this.updateModuleNotification
      .mutate({
        rq: {data: notification},
      })
      .pipe(map(({data}: any) => data.updateNotification));
  }
}
