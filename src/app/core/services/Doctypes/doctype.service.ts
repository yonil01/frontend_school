import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {DoctypeQuery, CreateDoctypeGroupQuery} from './doctype.query.service';
import {Observable} from 'rxjs';
import {Response, DocTypeGroups} from '@app/core/models';

@Injectable({
  providedIn: 'root',
})
export class DoctypeService {
  constructor(
    private doctypeQuery: DoctypeQuery,
    private createDoctypeGroupQuery: CreateDoctypeGroupQuery
  ) {
  }

  public getDoctypeGroups(): Observable<Response> {
    return this.doctypeQuery.watch({}).valueChanges.pipe(map(({data}: any) => data.getDoctypeGroups));
  }

  public createDoctypeGroup(doctypegroup: DocTypeGroups): Observable<Response> {
    return this.createDoctypeGroupQuery
      .mutate({
        rq: {data: doctypegroup},
      })
      .pipe(map(({data}: any) => data.createDoctypeGroups));
  }
}
