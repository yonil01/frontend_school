import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Classroom, Response, ClassroomRole, NewUserSecurityEntity, NewUserAttribute } from '@app/core/models';
import { Observable } from 'rxjs';
import {
  GetClassroomsQuery,
  GetClassroomByIDQuery,
  CreateClassroomQuery,
  UpdateClassroomQuery,
  DeleteClassroomQuery,
  BlockClassroomQuery,
  UnBlockClassroomQuery,
  LogoutClassroomQuery,
  GetClassroomsQueryCpy,
  //GetRoles,
  GetRolesById,
  UpdatePasswordByAdministratorQuery,
  ChangePassClassroom,
  CreateClassroomsRolesQuery,
  GetClassroomsByRolesAllowQuery,
  GetRolesAllowByClassroomQuery,
  GetClassroomsRolesByClassroomIDQuery,
  DeleteClassroomsRolesQuery,
  CreateClassroomsAttributeQuery,
  CreateClassroomsSecurityEntityQuery,
  DeleteClassroomsSecurityEntityQuery,
  DeleteClassroomsAttributeQuery, GetClassroomByName, activeQueryClassroom,
} from "@app/modules/administration/modules/classroom/service/classroom/classroom.queries.service";
import { HttpClient } from '@angular/common/http';
import { EnvServiceProvider } from '@app/core/services/env/env.service.provider';
import { JwtHelperService } from '@auth0/angular-jwt';
import {NewClassroomAttribute, NewClassroomSecurityEntity} from "@app/core/models/auth/classroom";

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root',
})
export class ClassroomsService {
  constructor(
    private getClassroomsQuery: GetClassroomsQuery,
    private getClassroomsByRolesAllowQuery: GetClassroomsByRolesAllowQuery,
    private getClassroomsQuery2: GetClassroomsQueryCpy,
    private getClassroomByIDQuery: GetClassroomByIDQuery,
    private createClassroomQuery: CreateClassroomQuery,
    private updateClassroomQuery: UpdateClassroomQuery,
    private deleteClassroomQuery: DeleteClassroomQuery,
    private blockClassroomQuery: BlockClassroomQuery,
    private unBlockClassroomQuery: UnBlockClassroomQuery,
    private logoutClassroomQuery: LogoutClassroomQuery,
    //private getRolesQry: GetRoles,
    private getRolesAllowByClassroomQuery: GetRolesAllowByClassroomQuery,
    private getRolesByIdQry: GetRolesById,
    private updatePasswordByAdministratorQuery: UpdatePasswordByAdministratorQuery,
    private changepwdClassroomQry: ChangePassClassroom,
    private getClassroomQueryByName: GetClassroomByName,
    private activeQueryClassroom: activeQueryClassroom,
    private createClassroomsRolesQuery: CreateClassroomsRolesQuery,
    private getClassroomsRolesByClassroomIDQuery: GetClassroomsRolesByClassroomIDQuery,
    private deleteClassroomsRolesQuery: DeleteClassroomsRolesQuery,
    private createClassroomsAttributeQuery: CreateClassroomsAttributeQuery,
    private createClassroomsSecurityEntityQuery: CreateClassroomsSecurityEntityQuery,
    private deleteClassroomsSecurityEntityQuery: DeleteClassroomsSecurityEntityQuery,
    private deleteClassroomsAttributeyQuery: DeleteClassroomsAttributeQuery,
    private _httpClient: HttpClient,
  ) {
  }

  getClassroomByID(id: string): Observable<Response> {
    return this.getClassroomByIDQuery
      .watch({
        id,
      })
      .valueChanges.pipe(map(({ data }: any) => data.getClassroomByID));
  }

  getAllClassrooms(): Observable<Response> {
    return this.getClassroomsQuery.watch({}).valueChanges.pipe(map(({ data }: any) => data.getClassrooms));
  }

  getClassroomsByRolesAllow(): Observable<Response> {
    return this.getClassroomsByRolesAllowQuery
      .watch({})
      .valueChanges.pipe(map(({ data }: any) => data.getClassroomsByRolesAllow));
  }

  getAllClassrooms2(): Observable<Response> {
    return this.getClassroomsQuery2.watch({}).valueChanges.pipe(map(({ data }: any) => data.getClassrooms));
  }



  updateClassroom(Classroom: Classroom) {
    const url = 'https://systemschoolramonv1.herokuapp.com/api/v1/classrooms/update';
    return this._httpClient.post(url,Classroom).pipe(map((res) => res));
  }

  createClassroom(Classroom: Classroom) {
    const url = 'https://systemschoolramonv1.herokuapp.com/api/v1/classrooms/create';
    return this._httpClient.post(url,Classroom).pipe(map((res) => res));
  }

  deleteClassroom(Classroom: Classroom) {
    const url = 'https://systemschoolramonv1.herokuapp.com/api/v1/classrooms/delete';
    return this._httpClient.post(url,Classroom).pipe(map((res) => res));
  }

  blockClassroom(Classroom: string): Observable<Response> {
    return this.blockClassroomQuery
      .mutate({
        id: Classroom,
      })
      .pipe(map(({ data }: any) => data.blockClassroom));
  }

  unblockClassroom(Classroom: string): Observable<Response> {
    return this.unBlockClassroomQuery
      .mutate({
        id: Classroom,
      })
      .pipe(map(({ data }: any) => data.unblockClassroom));
  }

  /*getRoles(): Observable<Response> {
    return this.getRolesQry.watch({}).valueChanges.pipe(map(({ data }: any) => data.getRoles));
  }*/

  getRolesAllowByClassroom(): Observable<Response> {
    return this.getRolesAllowByClassroomQuery.watch({}).valueChanges.pipe(map(({ data }: any) => data.getRolesAllowByClassroom));
  }

  getRolesById(ide: string): Observable<Response> {
    return this.getRolesByIdQry
      .watch({
        id: ide,
      })
      .valueChanges.pipe(map(({ data }: any) => data.getRoleByID));
  }

  updatePasswordByAdministrator(Classroom: string, pass: string, passConfirm: string): Observable<Response> {
    return this.updatePasswordByAdministratorQuery
      .mutate({
        id: Classroom,
        password: pass,
        Password_confirm: passConfirm,
      })
      .pipe(map(({ data }: any) => data.UpdatePasswordByAdministrator));
  }

  changePassClassroom(Classroom: string, pass: string, passConfirm: string, passOld: string): Observable<Response> {
    return this.changepwdClassroomQry
      .mutate({
        id: Classroom,
        password: pass,
        Password_confirm: passConfirm,
        Password_old: passOld,
      })
      .pipe(map(({ data }: any) => data.UpdatePasswordByClassroom));
  }

  getClassroomsRolesByClassroomID(id: string): Observable<Response> {
    return this.getClassroomsRolesByClassroomIDQuery
      .watch({
        Classroom_id: id,
      })
      .valueChanges.pipe(map(({ data }: any) => data.getClassroomsRolesByClassroomID));
  }

  createClassroomRoles(ClassroomRole: ClassroomRole): Observable<Response> {
    return this.createClassroomsRolesQuery
      .mutate({
        req: { data: ClassroomRole },
      })
      .pipe(map(({ data }: any) => data.createClassroomsRoles));
  }

  deleteClassroomsRoles(id: string): Observable<Response> {
    return this.deleteClassroomsRolesQuery
      .mutate({
        id: id,
      })
      .pipe(map(({ data }: any) => data.deleteClassroomsRoles));
  }

  createClassroomsSecurityEntity(ClassroomAttribute: NewClassroomSecurityEntity): Observable<Response> {
    return this.createClassroomsSecurityEntityQuery
      .mutate({
        request: { data: ClassroomAttribute },
      })
      .pipe(map(({ data }: any) => data.createClassroomsSecurityEntity));
  }

  createClassroomsAttribute(ClassroomAttribute: NewClassroomAttribute): Observable<Response> {
    return this.createClassroomsAttributeQuery
      .mutate({
        request: { data: ClassroomAttribute },
      })
      .pipe(map(({ data }: any) => data.createClassroomsAttribute));
  }

  deleteClassroomsSecurityEntity(id: string): Observable<Response> {
    return this.deleteClassroomsSecurityEntityQuery
      .mutate({
        id: id,
      })
      .pipe(map(({ data }: any) => data.deleteClassroomsSecurityEntity));
  }

  deleteClassroomsAttributey(id: string): Observable<Response> {
    return this.deleteClassroomsAttributeyQuery
      .mutate({
        id: id,
      })
      .pipe(map(({ data }: any) => data.deleteClassroomsAttribute));
  }

  validateClassroomPassword(password: any) {
    const url = EnvServiceProvider.useFactory().REST_API + '/api/v1/auth/password-policy';
    return this._httpClient.post(url, password).pipe(map((res) => res));
  }

  public getClassroomFormSesStorage(): any {
    let Classroom: any;
    const token = sessionStorage.getItem('Token');
    if (token) {
      Classroom = helper.decodeToken(token);
    }
    return Classroom;
  }

  getClassroomByName(Classroom: any): Observable<Response> {
    return this.getClassroomQueryByName
      .mutate(
        Classroom
      )
      .pipe(map(({ data }: any) => data.getClassroomByName));
  }

  activeClassroom(id: string): Observable<Response> {
    return this.activeQueryClassroom
      .mutate(
        {id}
      )
      .pipe(map(({ data }: any) => data.activeClassroom));
  }

  public getClassroomAll() {
    const url = 'https://systemschoolramonv1.herokuapp.com/api/v1/classrooms/all';
    return this._httpClient.get(url).pipe(map((res) => res));
  }
}
