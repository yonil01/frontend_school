
import {Injectable} from '@angular/core';
import {
  CreateBlackListPwd, DeleteBlackListPwd,
  GetPwdNotAllowed, UpdateBlackListPwd
} from "@app/modules/administration/modules/passwords-not-allowed/services/pwd-not-allowed.query";
import {Observable} from "rxjs/internal/Observable";
import {
  PwdNotAllowed,
  ResponseCreateBlackListPwd, ResponseDeleteBlackListPwd,
  ResponseGetPwdNotAllowed
} from "@app/modules/administration/modules/passwords-not-allowed/models/pwdNotAllowed.models";
import {map} from "rxjs/operators";



@Injectable({
  providedIn: 'root'
})
export class PasswordNotAllowedService {

  constructor(
    private getPwdNotAllowedQuery: GetPwdNotAllowed,
    private createBlackListPwdMutation: CreateBlackListPwd,
    private deleteBlackListPwdQuery: DeleteBlackListPwd,
    private updateBlackListPwdQry: UpdateBlackListPwd
  ) {
  }

  public getPwdNotAllowed(): Observable<ResponseGetPwdNotAllowed> {
    return this.getPwdNotAllowedQuery.watch().valueChanges.pipe(map(({data}: any) => data.getBlackListPwd));
  }

  public CreateBlackListPwd(password: string): Observable<ResponseCreateBlackListPwd> {
    return this.createBlackListPwdMutation.mutate({
      rq: {
        data: {
          password
        }
      }
    }).pipe(map(({data}: any) => data.createBlackListPwd));
  }

   public DeleteBlackListPwd(id: number): Observable<ResponseDeleteBlackListPwd> {
    return this.deleteBlackListPwdQuery.mutate({
      id
    }).pipe(map(({data}: any) => data.deleteBlackListPwd));
  }

  public UpdateBlackListPwd(password:PwdNotAllowed): Observable<ResponseCreateBlackListPwd> {
    return this.updateBlackListPwdQry.mutate({
        rq: {
          data:password
          
        }
      }).pipe(map(({ data }: any) => data.updateBlackListPwd));
  }

}



