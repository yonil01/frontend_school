import { Injectable } from '@angular/core';
import {Entity, Response} from "@app/core/models";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {CreateRequiredQuery} from "@app/modules/wizard/documents/services/annexe/annexe.queries.service";
import {NewRequired} from "@app/core/models/config/annexe";

@Injectable({
  providedIn: 'root'
})
export class AnnexeService {

  constructor(private createRequiredQuery: CreateRequiredQuery) { }

  public createRequired(required: NewRequired): Observable<Response> {
    return this.createRequiredQuery
      .mutate({
        requestRequired: {data: required},
      })
      .pipe(map(({data}: any) => data.createRequired));
  }

}
