import {Injectable} from '@angular/core';
import {
  CreateBlackListPwd,
  GetPwdNotAllowed
} from "@app/modules/administration/modules/passwords-not-allowed/services/pwd-not-allowed.query";
import {Observable} from "rxjs/internal/Observable";
import {
  ResponseCreateBlackListPwd,
  ResponseGetPwdNotAllowed
} from "@app/modules/administration/modules/passwords-not-allowed/models/pwdNotAllowed.models";
import {map} from "rxjs/operators";
import {CreateBlacklistPwd} from "@app/modules/administration/services/black-list/black-list-query.service";
import {data} from "autoprefixer";


@Injectable({
  providedIn: 'root'
})
export class PasswordNotAllowedService {

  constructor(
    private getPwdNotAllowedQuery: GetPwdNotAllowed,
    private createBlackListPwdMutation: CreateBlackListPwd
  ) {
  }

  public getPwdNotAllowed(): Observable<ResponseGetPwdNotAllowed> {
    return this.getPwdNotAllowedQuery.watch().valueChanges.pipe(map(({data}: any) => data.getBlackListPwd));
  }

  public CreateBlackListPwd(password: string): Observable<ResponseCreateBlackListPwd> {
    return this.createBlackListPwdMutation.mutate({
      rq: {
        data:{
          password
        }
      }
    }).pipe(map(({data}: any) => data.createBlackListPwd));
  }

}


