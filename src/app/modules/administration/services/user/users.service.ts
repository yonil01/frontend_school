import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { User, Response, UserRole, NewUserSecurityEntity, NewUserAttribute } from '@app/core/models';
import { Observable } from 'rxjs';
import {
  GetUsersQuery,
  GetUserByIDQuery,
  CreateUserQuery,
  UpdateUserQuery,
  DeleteUserQuery,
  BlockUserQuery,
  UnBlockUserQuery,
  LogoutUserQuery,
  GetUsersQueryCpy,
  GetRoles,
  GetRolesById,
  UpdatePasswordByAdministratorQuery,
  ChangePassUser,
  CreateUsersRolesQuery,
  GetUsersByRolesAllowQuery,
  GetRolesAllowByUserQuery,
  GetUsersRolesByUserIDQuery,
  DeleteUsersRolesQuery,
  CreateUsersAttributeQuery,
  CreateUsersSecurityEntityQuery,
  DeleteUsersSecurityEntityQuery,
  DeleteUsersAttributeQuery,
} from '@app/modules/administration/services/user/users.queries.service';
import { HttpClient } from '@angular/common/http';
import { EnvServiceProvider } from '@app/core/services/env/env.service.provider';
import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(
    private getUsersQuery: GetUsersQuery,
    private getUsersByRolesAllowQuery: GetUsersByRolesAllowQuery,
    private getUsersQuery2: GetUsersQueryCpy,
    private getUserByIDQuery: GetUserByIDQuery,
    private createUserQuery: CreateUserQuery,
    private updateUserQuery: UpdateUserQuery,
    private deleteUserQuery: DeleteUserQuery,
    private blockUserQuery: BlockUserQuery,
    private unBlockUserQuery: UnBlockUserQuery,
    private logoutUserQuery: LogoutUserQuery,
    private getRolesQry: GetRoles,
    private getRolesAllowByUserQuery: GetRolesAllowByUserQuery,
    private getRolesByIdQry: GetRolesById,
    private updatePasswordByAdministratorQuery: UpdatePasswordByAdministratorQuery,
    private changepwdUserQry: ChangePassUser,
    private createUsersRolesQuery: CreateUsersRolesQuery,
    private getUsersRolesByUserIDQuery: GetUsersRolesByUserIDQuery,
    private deleteUsersRolesQuery: DeleteUsersRolesQuery,
    private createUsersAttributeQuery: CreateUsersAttributeQuery,
    private createUsersSecurityEntityQuery: CreateUsersSecurityEntityQuery,
    private deleteUsersSecurityEntityQuery: DeleteUsersSecurityEntityQuery,
    private deleteUsersAttributeyQuery: DeleteUsersAttributeQuery,
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

  getAllUsers(): Observable<Response> {
    return this.getUsersQuery.watch({}).valueChanges.pipe(map(({ data }: any) => data.getUsers));
  }

  getUsersByRolesAllow(): Observable<Response> {
    return this.getUsersByRolesAllowQuery
      .watch({})
      .valueChanges.pipe(map(({ data }: any) => data.getUsersByRolesAllow));
  }

  getAllUsers2(): Observable<Response> {
    return this.getUsersQuery2.watch({}).valueChanges.pipe(map(({ data }: any) => data.getUsers));
  }

  createUser(user: User): Observable<Response> {
    return this.createUserQuery
      .mutate({
        rq: { data: user },
      })
      .pipe(map(({ data }: any) => data.createUser));
  }

  updateUser(user: User): Observable<Response> {
    return this.updateUserQuery
      .mutate({
        rq: { data: user },
      })
      .pipe(map(({ data }: any) => data.updateUser));
  }

  deleteUser(user: string): Observable<Response> {
    return this.deleteUserQuery
      .mutate({
        id: user,
      })
      .pipe(map(({ data }: any) => data.deleteUser));
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

  getRoles(): Observable<Response> {
    return this.getRolesQry.watch({}).valueChanges.pipe(map(({ data }: any) => data.getRoles));
  }

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

  getUsersRolesByUserID(id: string): Observable<Response> {
    return this.getUsersRolesByUserIDQuery
      .watch({
        user_id: id,
      })
      .valueChanges.pipe(map(({ data }: any) => data.getUsersRolesByUserID));
  }

  createUserRoles(userRole: UserRole): Observable<Response> {
    return this.createUsersRolesQuery
      .mutate({
        req: { data: userRole },
      })
      .pipe(map(({ data }: any) => data.createUsersRoles));
  }

  deleteUsersRoles(id: string): Observable<Response> {
    return this.deleteUsersRolesQuery
      .mutate({
        id: id,
      })
      .pipe(map(({ data }: any) => data.deleteUsersRoles));
  }

  createUsersSecurityEntity(userAttribute: NewUserSecurityEntity): Observable<Response> {
    return this.createUsersSecurityEntityQuery
      .mutate({
        request: { data: userAttribute },
      })
      .pipe(map(({ data }: any) => data.createUsersSecurityEntity));
  }

  createUsersAttribute(userAttribute: NewUserAttribute): Observable<Response> {
    return this.createUsersAttributeQuery
      .mutate({
        request: { data: userAttribute },
      })
      .pipe(map(({ data }: any) => data.createUsersAttribute));
  }

  deleteUsersSecurityEntity(id: string): Observable<Response> {
    return this.deleteUsersSecurityEntityQuery
      .mutate({
        id: id,
      })
      .pipe(map(({ data }: any) => data.deleteUsersSecurityEntity));
  }

  deleteUsersAttributey(id: string): Observable<Response> {
    return this.deleteUsersAttributeyQuery
      .mutate({
        id: id,
      })
      .pipe(map(({ data }: any) => data.deleteUsersAttribute));
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
}
