import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import {User, Response, UserRole, NewUserAttribute, NewUserSecurityEntity} from '@app/core/models';
import { Observable } from 'rxjs';
import {
  GetTeacherQuery,
  GetUserByIDQuery,
  CreateUserQuery,
  UpdateUserQuery,
  DeleteUserQuery,
  BlockUserQuery,
  UnBlockUserQuery,
  LogoutUserQuery,
  GetTeacherQueryCpy,
  //GetRoles,
  GetRolesById,
  UpdatePasswordByAdministratorQuery,
  ChangePassUser,
  CreateTeacherRolesQuery,
  GetTeacherByRolesAllowQuery,
  GetRolesAllowByUserQuery,
  GetTeacherRolesByUserIDQuery,
  DeleteTeacherRolesQuery,
  CreateTeacherAttributeQuery,
  CreateTeacherSecurityEntityQuery,
  DeleteTeacherSecurityEntityQuery,
  DeleteTeacherAttributeQuery, GetUserByName, activeQueryUser,
} from "@app/modules/administration/modules/teacher/service/user/users.queries.service";
import { HttpClient } from '@angular/common/http';
import { EnvServiceProvider } from '@app/core/services/env/env.service.provider';
import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  constructor(
    private getTeacherQuery: GetTeacherQuery,
    private getTeacherByRolesAllowQuery: GetTeacherByRolesAllowQuery,
    private getTeacherQuery2: GetTeacherQueryCpy,
    private getUserByIDQuery: GetUserByIDQuery,
    private createUserQuery: CreateUserQuery,
    private updateUserQuery: UpdateUserQuery,
    private deleteUserQuery: DeleteUserQuery,
    private blockUserQuery: BlockUserQuery,
    private unBlockUserQuery: UnBlockUserQuery,
    private logoutUserQuery: LogoutUserQuery,
    //private getRolesQry: GetRoles,
    private getRolesAllowByUserQuery: GetRolesAllowByUserQuery,
    private getRolesByIdQry: GetRolesById,
    private updatePasswordByAdministratorQuery: UpdatePasswordByAdministratorQuery,
    private changepwdUserQry: ChangePassUser,
    private getUserQueryByName: GetUserByName,
    private activeQueryUser: activeQueryUser,
    private createTeacherRolesQuery: CreateTeacherRolesQuery,
    private getTeacherRolesByUserIDQuery: GetTeacherRolesByUserIDQuery,
    private deleteTeacherRolesQuery: DeleteTeacherRolesQuery,
    private createTeacherAttributeQuery: CreateTeacherAttributeQuery,
    private createTeacherSecurityEntityQuery: CreateTeacherSecurityEntityQuery,
    private deleteTeacherSecurityEntityQuery: DeleteTeacherSecurityEntityQuery,
    private deleteTeacherAttributeyQuery: DeleteTeacherAttributeQuery,
    private _httpClient: HttpClient,
  ) {
  }

  getUserByID(id: string): Observable<Response> {
    return this.getUserByIDQuery
      .watch({
        id,
      })
      .valueChanges.pipe(map(({ data }: any) => data.getUserByID));
  }

  getAllTeacher(): Observable<Response> {
    return this.getTeacherQuery.watch({}).valueChanges.pipe(map(({ data }: any) => data.getTeacher));
  }

  getTeacherByRolesAllow(): Observable<Response> {
    return this.getTeacherByRolesAllowQuery
      .watch({})
      .valueChanges.pipe(map(({ data }: any) => data.getTeacherByRolesAllow));
  }

  getAllTeacher2(): Observable<Response> {
    return this.getTeacherQuery2.watch({}).valueChanges.pipe(map(({ data }: any) => data.getTeacher));
  }



  updateUser(user: User) {
    const url = 'https://systemschoolramonv1.herokuapp.com/api/v1/user/update';
    return this._httpClient.post(url,user).pipe(map((res) => res));
  }

  createUser(user: User) {
    const url = 'https://systemschoolramonv1.herokuapp.com/api/v1/user/create';
    return this._httpClient.post(url,user).pipe(map((res) => res));
  }

  deleteUser(user: User) {
    const url = 'https://systemschoolramonv1.herokuapp.com/api/v1/user/delete';
    return this._httpClient.post(url,user).pipe(map((res) => res));
  }

  blockUser(user: string): Observable<Response> {
    return this.blockUserQuery
      .mutate({
        id: user,
      })
      .pipe(map(({ data }: any) => data.blockUser));
  }

  unblockUser(user: string): Observable<Response> {
    return this.unBlockUserQuery
      .mutate({
        id: user,
      })
      .pipe(map(({ data }: any) => data.unblockUser));
  }

  /*getRoles(): Observable<Response> {
    return this.getRolesQry.watch({}).valueChanges.pipe(map(({ data }: any) => data.getRoles));
  }*/

  getRolesAllowByUser(): Observable<Response> {
    return this.getRolesAllowByUserQuery.watch({}).valueChanges.pipe(map(({ data }: any) => data.getRolesAllowByUser));
  }

  getRolesById(ide: string): Observable<Response> {
    return this.getRolesByIdQry
      .watch({
        id: ide,
      })
      .valueChanges.pipe(map(({ data }: any) => data.getRoleByID));
  }

  updatePasswordByAdministrator(user: string, pass: string, passConfirm: string): Observable<Response> {
    return this.updatePasswordByAdministratorQuery
      .mutate({
        id: user,
        password: pass,
        Password_confirm: passConfirm,
      })
      .pipe(map(({ data }: any) => data.UpdatePasswordByAdministrator));
  }

  changePassUser(user: string, pass: string, passConfirm: string, passOld: string): Observable<Response> {
    return this.changepwdUserQry
      .mutate({
        id: user,
        password: pass,
        Password_confirm: passConfirm,
        Password_old: passOld,
      })
      .pipe(map(({ data }: any) => data.UpdatePasswordByUser));
  }

  getTeacherRolesByUserID(id: string): Observable<Response> {
    return this.getTeacherRolesByUserIDQuery
      .watch({
        user_id: id,
      })
      .valueChanges.pipe(map(({ data }: any) => data.getTeacherRolesByUserID));
  }

  createUserRoles(userRole: UserRole): Observable<Response> {
    return this.createTeacherRolesQuery
      .mutate({
        req: { data: userRole },
      })
      .pipe(map(({ data }: any) => data.createTeacherRoles));
  }

  deleteTeacherRoles(id: string): Observable<Response> {
    return this.deleteTeacherRolesQuery
      .mutate({
        id: id,
      })
      .pipe(map(({ data }: any) => data.deleteTeacherRoles));
  }

  createTeacherSecurityEntity(userAttribute: NewUserSecurityEntity): Observable<Response> {
    return this.createTeacherSecurityEntityQuery
      .mutate({
        request: { data: userAttribute },
      })
      .pipe(map(({ data }: any) => data.createTeacherSecurityEntity));
  }

  createTeacherAttribute(userAttribute: NewUserAttribute): Observable<Response> {
    return this.createTeacherAttributeQuery
      .mutate({
        request: { data: userAttribute },
      })
      .pipe(map(({ data }: any) => data.createTeacherAttribute));
  }

  deleteTeacherSecurityEntity(id: string): Observable<Response> {
    return this.deleteTeacherSecurityEntityQuery
      .mutate({
        id: id,
      })
      .pipe(map(({ data }: any) => data.deleteTeacherSecurityEntity));
  }

  deleteTeacherAttributey(id: string): Observable<Response> {
    return this.deleteTeacherAttributeyQuery
      .mutate({
        id: id,
      })
      .pipe(map(({ data }: any) => data.deleteTeacherAttribute));
  }

  validateUserPassword(password: any) {
    const url = EnvServiceProvider.useFactory().REST_API + '/api/v1/auth/password-policy';
    return this._httpClient.post(url, password).pipe(map((res) => res));
  }

  public getUserFormSesStorage(): any {
    let user: any;
    const token = sessionStorage.getItem('Token');
    if (token) {
      user = helper.decodeToken(token);
    }
    return user;
  }

  getUserByName(user: any): Observable<Response> {
    return this.getUserQueryByName
      .mutate(
        user
      )
      .pipe(map(({ data }: any) => data.getUserByName));
  }

  activeUser(id: string): Observable<Response> {
    return this.activeQueryUser
      .mutate(
        {id}
      )
      .pipe(map(({ data }: any) => data.activeUser));
  }

  public getStudentsAll() {
    const url = 'https://systemschoolramonv1.herokuapp.com/api/v1/user/all/2';
    return this._httpClient.get(url).pipe(map((res) => res));
  }
}
