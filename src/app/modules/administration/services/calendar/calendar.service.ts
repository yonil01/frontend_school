import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Response} from "@app/core/models";
import {map} from "rxjs/operators";
import {
  CreateCalendar, CreateCalendarHoliday, CreateCalendarWorkingDaysWeeks,
  DeleteCalendar, DeleteCalendarWorkingDaysWeeks,
  GetCalendars, UpdateCalendar, UpdateCalendarWorkingDaysWeeks
} from "@app/modules/administration/services/calendar/calendar.queries.service";
import {Calendar} from "@app/core/models/config/calendar";
import {
  CalendarHolidays,
  CalendarWorkingDayWeek
} from "@app/modules/administration/modules/calendar/models/calendary.model";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(
    private createModuleCalendar: CreateCalendar,
    private getModulesCalendars: GetCalendars,
    private deleteModuleCalendar: DeleteCalendar,
    private updateModuleCalendar: UpdateCalendar,
    private createModuleCalendarWorkingDaysWeeks: CreateCalendarWorkingDaysWeeks,
    private deleteModuleCalendarWorkingDaysWeeks: DeleteCalendarWorkingDaysWeeks,
    private updateModuleCalendarWorkingDaysWeeks: UpdateCalendarWorkingDaysWeeks,
    private createModuleCalendarHoliday: CreateCalendarHoliday,
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

  createCalendarWorkingDaysWeeks(calendarWorkingDayWeek: CalendarWorkingDayWeek): Observable<Response> {
    return this.createModuleCalendarWorkingDaysWeeks
      .mutate({
        rq: {data: calendarWorkingDayWeek},
      })
      .pipe(map(({data}: any) => data.createCalendarWorkingDaysWeeks));
  }

  getCalendarWorkingDaysWeeks(): Observable<Response> {
    return this.getModulesCalendars.watch().valueChanges.pipe(map(({data}: any) => data.getCalendar));
  }

  deleteCalendarWorkingDaysWeeks(id: string): Observable<Response> {
    return this.deleteModuleCalendarWorkingDaysWeeks
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => data.deleteCalendarWorkingDaysWeeks));
  }

  updateCalendarWorkingDaysWeeks(calendarWorkingDayWeek: CalendarWorkingDayWeek): Observable<Response> {
    return this.updateModuleCalendarWorkingDaysWeeks
      .mutate({
        rq: {data: calendarWorkingDayWeek},
      })
      .pipe(map(({data}: any) => data.updateCalendarWorkingDaysWeeks));
  }

  createCalendarHoliday(calendarHoliday: CalendarHolidays): Observable<Response> {
    return this.createModuleCalendarHoliday
      .mutate({
        rq: {data: calendarHoliday},
      })
      .pipe(map(({data}: any) => data.createCalendarHoliday));
  }

  getCalendarCalendarHoliday(): Observable<Response> {
    return this.getModulesCalendars.watch().valueChanges.pipe(map(({data}: any) => data.getCalendar));
  }

  deleteCalendarHoliday(id: string): Observable<Response> {
    return this.deleteModuleCalendarWorkingDaysWeeks
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => data.deleteCalendarWorkingDaysWeeks));
  }

  updateCalendarHoliday(calendarHoliday: CalendarHolidays): Observable<Response> {
    return this.updateModuleCalendarWorkingDaysWeeks
      .mutate({
        rq: {data: calendarHoliday},
      })
      .pipe(map(({data}: any) => data.updateCalendarWorkingDaysWeeks));
  }
}
