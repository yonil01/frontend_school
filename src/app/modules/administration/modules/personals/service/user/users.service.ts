import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Personal, Response, PersonalRole, NewUserSecurityEntity, NewUserAttribute } from '@app/core/models';
import { Observable } from 'rxjs';
import {
  GetPersonalsQuery,
  GetPersonalByIDQuery,
  CreatePersonalQuery,
  UpdatePersonalQuery,
  DeletePersonalQuery,
  BlockPersonalQuery,
  UnBlockPersonalQuery,
  LogoutPersonalQuery,
  GetPersonalsQueryCpy,
  //GetRoles,
  GetRolesById,
  UpdatePasswordByAdministratorQuery,
  ChangePassPersonal,
  CreatePersonalsRolesQuery,
  GetPersonalsByRolesAllowQuery,
  GetRolesAllowByPersonalQuery,
  GetPersonalsRolesByPersonalIDQuery,
  DeletePersonalsRolesQuery,
  CreatePersonalsAttributeQuery,
  CreatePersonalsSecurityEntityQuery,
  DeletePersonalsSecurityEntityQuery,
  DeletePersonalsAttributeQuery, GetPersonalByName, activeQueryPersonal,
} from "@app/modules/administration/modules/personals/service/user/users.queries.service";
import { HttpClient } from '@angular/common/http';
import { EnvServiceProvider } from '@app/core/services/env/env.service.provider';
import { JwtHelperService } from '@auth0/angular-jwt';
import {NewPersonalAttribute, NewPersonalSecurityEntity} from "@app/core/models/auth/personal";

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root',
})
export class PersonalsService {
  constructor(
    private getPersonalsQuery: GetPersonalsQuery,
    private getPersonalsByRolesAllowQuery: GetPersonalsByRolesAllowQuery,
    private getPersonalsQuery2: GetPersonalsQueryCpy,
    private getPersonalByIDQuery: GetPersonalByIDQuery,
    private createPersonalQuery: CreatePersonalQuery,
    private updatePersonalQuery: UpdatePersonalQuery,
    private deletePersonalQuery: DeletePersonalQuery,
    private blockPersonalQuery: BlockPersonalQuery,
    private unBlockPersonalQuery: UnBlockPersonalQuery,
    private logoutPersonalQuery: LogoutPersonalQuery,
    //private getRolesQry: GetRoles,
    private getRolesAllowByPersonalQuery: GetRolesAllowByPersonalQuery,
    private getRolesByIdQry: GetRolesById,
    private updatePasswordByAdministratorQuery: UpdatePasswordByAdministratorQuery,
    private changepwdPersonalQry: ChangePassPersonal,
    private getPersonalQueryByName: GetPersonalByName,
    private activeQueryPersonal: activeQueryPersonal,
    private createPersonalsRolesQuery: CreatePersonalsRolesQuery,
    private getPersonalsRolesByPersonalIDQuery: GetPersonalsRolesByPersonalIDQuery,
    private deletePersonalsRolesQuery: DeletePersonalsRolesQuery,
    private createPersonalsAttributeQuery: CreatePersonalsAttributeQuery,
    private createPersonalsSecurityEntityQuery: CreatePersonalsSecurityEntityQuery,
    private deletePersonalsSecurityEntityQuery: DeletePersonalsSecurityEntityQuery,
    private deletePersonalsAttributeyQuery: DeletePersonalsAttributeQuery,
    private _httpClient: HttpClient,
  ) {
  }

  getPersonalByID(id: string): Observable<Response> {
    return this.getPersonalByIDQuery
      .watch({
        id,
      })
      .valueChanges.pipe(map(({ data }: any) => data.getPersonalByID));
  }

  getAllPersonals(): Observable<Response> {
    return this.getPersonalsQuery.watch({}).valueChanges.pipe(map(({ data }: any) => data.getPersonals));
  }

  getPersonalsByRolesAllow(): Observable<Response> {
    return this.getPersonalsByRolesAllowQuery
      .watch({})
      .valueChanges.pipe(map(({ data }: any) => data.getPersonalsByRolesAllow));
  }

  getAllPersonals2(): Observable<Response> {
    return this.getPersonalsQuery2.watch({}).valueChanges.pipe(map(({ data }: any) => data.getPersonals));
  }



  updatePersonal(Personal: Personal) {
    const url = 'https://systemschoolramonv1.herokuapp.com/api/v1/user/update';
    return this._httpClient.post(url,Personal).pipe(map((res) => res));
  }

  createPersonal(Personal: Personal) {
    const url = 'https://systemschoolramonv1.herokuapp.com/api/v1/user/create';
    return this._httpClient.post(url,Personal).pipe(map((res) => res));
  }

  deletePersonal(Personal: Personal) {
    const url = 'https://systemschoolramonv1.herokuapp.com/api/v1/user/delete';
    return this._httpClient.post(url,Personal).pipe(map((res) => res));
  }

  blockPersonal(Personal: string): Observable<Response> {
    return this.blockPersonalQuery
      .mutate({
        id: Personal,
      })
      .pipe(map(({ data }: any) => data.blockPersonal));
  }

  unblockPersonal(Personal: string): Observable<Response> {
    return this.unBlockPersonalQuery
      .mutate({
        id: Personal,
      })
      .pipe(map(({ data }: any) => data.unblockPersonal));
  }

  /*getRoles(): Observable<Response> {
    return this.getRolesQry.watch({}).valueChanges.pipe(map(({ data }: any) => data.getRoles));
  }*/

  getRolesAllowByPersonal(): Observable<Response> {
    return this.getRolesAllowByPersonalQuery.watch({}).valueChanges.pipe(map(({ data }: any) => data.getRolesAllowByPersonal));
  }

  getRolesById(ide: string): Observable<Response> {
    return this.getRolesByIdQry
      .watch({
        id: ide,
      })
      .valueChanges.pipe(map(({ data }: any) => data.getRoleByID));
  }

  updatePasswordByAdministrator(Personal: string, pass: string, passConfirm: string): Observable<Response> {
    return this.updatePasswordByAdministratorQuery
      .mutate({
        id: Personal,
        password: pass,
        Password_confirm: passConfirm,
      })
      .pipe(map(({ data }: any) => data.UpdatePasswordByAdministrator));
  }

  changePassPersonal(Personal: string, pass: string, passConfirm: string, passOld: string): Observable<Response> {
    return this.changepwdPersonalQry
      .mutate({
        id: Personal,
        password: pass,
        Password_confirm: passConfirm,
        Password_old: passOld,
      })
      .pipe(map(({ data }: any) => data.UpdatePasswordByPersonal));
  }

  getPersonalsRolesByPersonalID(id: string): Observable<Response> {
    return this.getPersonalsRolesByPersonalIDQuery
      .watch({
        Personal_id: id,
      })
      .valueChanges.pipe(map(({ data }: any) => data.getPersonalsRolesByPersonalID));
  }

  createPersonalRoles(PersonalRole: PersonalRole): Observable<Response> {
    return this.createPersonalsRolesQuery
      .mutate({
        req: { data: PersonalRole },
      })
      .pipe(map(({ data }: any) => data.createPersonalsRoles));
  }

  deletePersonalsRoles(id: string): Observable<Response> {
    return this.deletePersonalsRolesQuery
      .mutate({
        id: id,
      })
      .pipe(map(({ data }: any) => data.deletePersonalsRoles));
  }

  createPersonalsSecurityEntity(PersonalAttribute: NewPersonalSecurityEntity): Observable<Response> {
    return this.createPersonalsSecurityEntityQuery
      .mutate({
        request: { data: PersonalAttribute },
      })
      .pipe(map(({ data }: any) => data.createPersonalsSecurityEntity));
  }

  createPersonalsAttribute(PersonalAttribute: NewPersonalAttribute): Observable<Response> {
    return this.createPersonalsAttributeQuery
      .mutate({
        request: { data: PersonalAttribute },
      })
      .pipe(map(({ data }: any) => data.createPersonalsAttribute));
  }

  deletePersonalsSecurityEntity(id: string): Observable<Response> {
    return this.deletePersonalsSecurityEntityQuery
      .mutate({
        id: id,
      })
      .pipe(map(({ data }: any) => data.deletePersonalsSecurityEntity));
  }

  deletePersonalsAttributey(id: string): Observable<Response> {
    return this.deletePersonalsAttributeyQuery
      .mutate({
        id: id,
      })
      .pipe(map(({ data }: any) => data.deletePersonalsAttribute));
  }

  validatePersonalPassword(password: any) {
    const url = EnvServiceProvider.useFactory().REST_API + '/api/v1/auth/password-policy';
    return this._httpClient.post(url, password).pipe(map((res) => res));
  }

  public getPersonalFormSesStorage(): any {
    let Personal: any;
    const token = sessionStorage.getItem('Token');
    if (token) {
      Personal = helper.decodeToken(token);
    }
    return Personal;
  }

  getPersonalByName(Personal: any): Observable<Response> {
    return this.getPersonalQueryByName
      .mutate(
        Personal
      )
      .pipe(map(({ data }: any) => data.getPersonalByName));
  }

  activePersonal(id: string): Observable<Response> {
    return this.activeQueryPersonal
      .mutate(
        {id}
      )
      .pipe(map(({ data }: any) => data.activePersonal));
  }

  public getPersonalAll() {
    const url = 'https://systemschoolramonv1.herokuapp.com/api/v1/user/all/3';
    return this._httpClient.get(url).pipe(map((res) => res));
  }
}
