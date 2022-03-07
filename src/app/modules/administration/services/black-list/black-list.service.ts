import { Injectable } from '@angular/core';
import { Response, BlackListPwd } from '@app/core/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CreateBlacklistPwd,
  DeleteBlacklistPwd,
  GetBlackListPwdQuery,
  UpdateBlackListPwd,
} from '@app/modules/administration/services/black-list/black-list-query.service';

@Injectable({
  providedIn: 'root',
})
export class BlackListService {

  constructor(
    private getBlackListPwdQuery: GetBlackListPwdQuery,
    private createBlacklistPwdQuery: CreateBlacklistPwd,
    private deleteBlacklistPwdQuery: DeleteBlacklistPwd,
    private updateBlackListPwdQuery: UpdateBlackListPwd,
  ) {}

  getBlackListPwd() {
    return this.getBlackListPwdQuery.watch({}).valueChanges.pipe(map(({ data }: any) => data.getBlackListPwd));
  }

  createBlacklistPwd(list: BlackListPwd): Observable<Response> {
    return this.createBlacklistPwdQuery
      .mutate({
        request: { data: list },
      })
      .pipe(map(({ data }: any) => data.createBlackListPwd));
  }

  deleteBlacklistPwd(pwd: number): Observable<Response> {
    return this.deleteBlacklistPwdQuery
      .mutate({
        id: pwd,
      })
      .pipe(map(({ data }: any) => data.deleteBlackListPwd));
  }

  updateBlackListPwd(dt: BlackListPwd): Observable<Response> {
    return this.updateBlackListPwdQuery
      .mutate({
        request: { data: dt },
      })
      .pipe(map(({ data }: any) => data.updateBlackListPwd));
  }
}
