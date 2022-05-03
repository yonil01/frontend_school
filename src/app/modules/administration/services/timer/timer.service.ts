import { Injectable } from '@angular/core';
import {
  CreateTimer,
  DeleteTimer,
  GetTimer,
  UpdateTimer
} from "@app/modules/administration/services/timer/timer.queries.service";
import {Observable} from "rxjs";
import {Response, Timer} from "@app/core/models";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  constructor(
    private createModuloTimer: CreateTimer,
    private getModuleTimer: GetTimer,
    private deleteModuleTimer: DeleteTimer,
    private updateModuleTimer: UpdateTimer,
  ) { }

  createTimer(timer: Timer): Observable<Response> {
    return this.createModuloTimer
      .mutate({
        rq: {data: timer},
      })
      .pipe(map(({data}: any) => data.createTimer));
  }

  getTimers(): Observable<Response> {
    return this.getModuleTimer.watch().valueChanges.pipe(map(({data}: any) => data.getTimer));
  }

  deleteAns(id: string): Observable<Response> {
    return this.deleteModuleTimer
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => data.deleteTimer));
  }

  updateTimer(Ans: Timer): Observable<Response> {
    return this.updateModuleTimer
      .mutate({
        rq: {data: Ans},
      })
      .pipe(map(({data}: any) => data.updateTimer));
  }
}
