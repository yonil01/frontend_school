import { Injectable } from '@angular/core';
import {NotificationModel} from "@app/core/models/config/notification";
import {Observable} from "rxjs";
import {Response} from "@app/core/models";
import {map} from "rxjs/operators";
import {
  CreateCalendar,
  DeleteCalendar,
  GetCalendars, UpdateCalendar
} from "@app/modules/administration/services/calendar/calendar.queries.service";
import {Calendar} from "@app/core/models/config/calendar";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(
    private createModuleCalendar: CreateCalendar,
    private getModulesCalendars: GetCalendars,
    private deleteModuleCalendar: DeleteCalendar,
    private updateModuleCalendar: UpdateCalendar
  ) { }

  createCalendar(calendar: Calendar): Observable<Response> {
    return this.createModuleCalendar
      .mutate({
        rq: {data: calendar},
      })
      .pipe(map(({data}: any) => data.createCalendars));
  }

  getCalendars(): Observable<Response> {
    return this.getModulesCalendars.watch().valueChanges.pipe(map(({data}: any) => data.getCalendar));
  }

  deleteCalendar(id: string): Observable<Response> {
    return this.deleteModuleCalendar
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => data.deleteCalendars));
  }

  updateCalendar(calendar: Calendar): Observable<Response> {
    return this.updateModuleCalendar
      .mutate({
        rq: {data: calendar},
      })
      .pipe(map(({data}: any) => data.updateCalendars));
  }
}
