import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '@app/core/models';
import { first, map } from 'rxjs/operators';
import { GetActivitiesQuery } from '../activity/activity.queries.service';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  constructor(private getActivitiesQuery: GetActivitiesQuery) {}

  public getActivities(): Observable<Response> {
    return this.getActivitiesQuery.watch().valueChanges.pipe(first(), map(({ data }: any) => data.getActivities));
  }
}
