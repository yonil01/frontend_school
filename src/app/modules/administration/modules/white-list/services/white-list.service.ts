import { Injectable } from '@angular/core';
import {
  CreateWhiteList,
  DeleteWhiteListQuery,
  GetWhiteList, UpdateWhiteList
} from "@app/modules/administration/modules/white-list/services/white-list.query";
import {Observable} from "rxjs";
import {
  WhiteList, ResponseCreateWhiteList, ResponseDeleteWhiteList,
  ResponseGetWhiteList
} from "@app/modules/administration/modules/white-list/models/white-list.models";
import {map} from "rxjs/operators";
import {data} from "autoprefixer";
import {Response} from "@app/core/models";



@Injectable({
  providedIn: 'root'
})
export class WhiteListService {

  constructor(
    private getWhiteListQuery: GetWhiteList,
    private createWhiteListMutation: CreateWhiteList,
    private deleteWhiteListQuery: DeleteWhiteListQuery,
    private updateWhiteListQuery: UpdateWhiteList
  ) {
  }

  public getWhiteList(): Observable<ResponseGetWhiteList> {
    return this.getWhiteListQuery.watch().valueChanges.pipe(map(({data}: any) => data.getWhiteList));
  }
  public createWhiteList(whiteList: WhiteList): Observable<ResponseCreateWhiteList> {
    return this.createWhiteListMutation.mutate({
      rq: {
        data: whiteList
      }
    }).pipe(map(({data}: any) => data.createWhiteList));
  }

  public deleteWhiteList(id: number): Observable<ResponseDeleteWhiteList> {
    return this.deleteWhiteListQuery.mutate({
      id
    }).pipe(map(({data}: any) => data.deleteWhiteList));
  }

  public updateWhiteLists(whiteList: WhiteList): Observable<Response> {
    return this.updateWhiteListQuery
      .mutate({
        req: { data: whiteList }
      })
      .pipe(map(({ data }: any) => data.updateWhiteList));
  }
}
