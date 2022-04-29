import {Injectable} from '@angular/core';
import {GetTimer} from "@app/core/services/graphql/config/timers/timers.queries.service";
import {Observable} from "rxjs";
import {Response} from "@app/core/models";
import {map} from "rxjs/operators";
@Injectable({
  providedIn: 'root',
})
export class QueueService {
  constructor(
     private getModuleTimer: GetTimer
  ) {

  }
  getTimers(): Observable<Response> {
    return this.getModuleTimer.watch().valueChanges.pipe(map(({data}: any) => data.getTimer));
  }
}
