import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subject, Response, SubjectRole, NewUserSecurityEntity, NewUserAttribute } from '@app/core/models';
import { Observable } from 'rxjs';
import {
  GetSubjectsQuery,
  GetSubjectByIDQuery,
  CreateSubjectQuery,
  UpdateSubjectQuery,
  DeleteSubjectQuery,
  BlockSubjectQuery,
  UnBlockSubjectQuery,
  LogoutSubjectQuery,
  GetSubjectsQueryCpy,
  //GetRoles,
  GetRolesById,
  UpdatePasswordByAdministratorQuery,
  ChangePassSubject,
  CreateSubjectsRolesQuery,
  GetSubjectsByRolesAllowQuery,
  GetRolesAllowBySubjectQuery,
  GetSubjectsRolesBySubjectIDQuery,
  DeleteSubjectsRolesQuery,
  CreateSubjectsAttributeQuery,
  CreateSubjectsSecurityEntityQuery,
  DeleteSubjectsSecurityEntityQuery,
  DeleteSubjectsAttributeQuery, GetSubjectByName, activeQuerySubject,
} from "@app/modules/administration/modules/subject/service/subject/subject.queries.service";
import { HttpClient } from '@angular/common/http';
import { EnvServiceProvider } from '@app/core/services/env/env.service.provider';
import { JwtHelperService } from '@auth0/angular-jwt';
import {NewSubjectAttribute, NewSubjectSecurityEntity} from "@app/core/models/auth/subject";

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root',
})
export class SubjectsService {
  constructor(
    private getSubjectsQuery: GetSubjectsQuery,
    private getSubjectsByRolesAllowQuery: GetSubjectsByRolesAllowQuery,
    private getSubjectsQuery2: GetSubjectsQueryCpy,
    private getSubjectByIDQuery: GetSubjectByIDQuery,
    private createSubjectQuery: CreateSubjectQuery,
    private updateSubjectQuery: UpdateSubjectQuery,
    private deleteSubjectQuery: DeleteSubjectQuery,
    private blockSubjectQuery: BlockSubjectQuery,
    private unBlockSubjectQuery: UnBlockSubjectQuery,
    private logoutSubjectQuery: LogoutSubjectQuery,
    //private getRolesQry: GetRoles,
    private getRolesAllowBySubjectQuery: GetRolesAllowBySubjectQuery,
    private getRolesByIdQry: GetRolesById,
    private updatePasswordByAdministratorQuery: UpdatePasswordByAdministratorQuery,
    private changepwdSubjectQry: ChangePassSubject,
    private getSubjectQueryByName: GetSubjectByName,
    private activeQuerySubject: activeQuerySubject,
    private createSubjectsRolesQuery: CreateSubjectsRolesQuery,
    private getSubjectsRolesBySubjectIDQuery: GetSubjectsRolesBySubjectIDQuery,
    private deleteSubjectsRolesQuery: DeleteSubjectsRolesQuery,
    private createSubjectsAttributeQuery: CreateSubjectsAttributeQuery,
    private createSubjectsSecurityEntityQuery: CreateSubjectsSecurityEntityQuery,
    private deleteSubjectsSecurityEntityQuery: DeleteSubjectsSecurityEntityQuery,
    private deleteSubjectsAttributeyQuery: DeleteSubjectsAttributeQuery,
    private _httpClient: HttpClient,
  ) {
  }

  getSubjectByID(id: string): Observable<Response> {
    return this.getSubjectByIDQuery
      .watch({
        id,
      })
      .valueChanges.pipe(map(({ data }: any) => data.getSubjectByID));
  }

  getAllSubjects(): Observable<Response> {
    return this.getSubjectsQuery.watch({}).valueChanges.pipe(map(({ data }: any) => data.getSubjects));
  }

  getSubjectsByRolesAllow(): Observable<Response> {
    return this.getSubjectsByRolesAllowQuery
      .watch({})
      .valueChanges.pipe(map(({ data }: any) => data.getSubjectsByRolesAllow));
  }

  getAllSubjects2(): Observable<Response> {
    return this.getSubjectsQuery2.watch({}).valueChanges.pipe(map(({ data }: any) => data.getSubjects));
  }



  updateSubject(Subject: Subject) {
    const url = 'https://systemschoolramonv1.herokuapp.com/api/v1/subjects/update';
    return this._httpClient.post(url,Subject).pipe(map((res) => res));
  }

  createSubject(Subject: Subject) {
    const url = 'https://systemschoolramonv1.herokuapp.com/api/v1/subjects/create';
    return this._httpClient.post(url,Subject).pipe(map((res) => res));
  }

  deleteSubject(Subject: Subject) {
    const url = 'https://systemschoolramonv1.herokuapp.com/api/v1/subjects/delete';
    return this._httpClient.post(url,Subject).pipe(map((res) => res));
  }

  blockSubject(Subject: string): Observable<Response> {
    return this.blockSubjectQuery
      .mutate({
        id: Subject,
      })
      .pipe(map(({ data }: any) => data.blockSubject));
  }

  unblockSubject(Subject: string): Observable<Response> {
    return this.unBlockSubjectQuery
      .mutate({
        id: Subject,
      })
      .pipe(map(({ data }: any) => data.unblockSubject));
  }

  /*getRoles(): Observable<Response> {
    return this.getRolesQry.watch({}).valueChanges.pipe(map(({ data }: any) => data.getRoles));
  }*/

  getRolesAllowBySubject(): Observable<Response> {
    return this.getRolesAllowBySubjectQuery.watch({}).valueChanges.pipe(map(({ data }: any) => data.getRolesAllowBySubject));
  }

  getRolesById(ide: string): Observable<Response> {
    return this.getRolesByIdQry
      .watch({
        id: ide,
      })
      .valueChanges.pipe(map(({ data }: any) => data.getRoleByID));
  }

  updatePasswordByAdministrator(Subject: string, pass: string, passConfirm: string): Observable<Response> {
    return this.updatePasswordByAdministratorQuery
      .mutate({
        id: Subject,
        password: pass,
        Password_confirm: passConfirm,
      })
      .pipe(map(({ data }: any) => data.UpdatePasswordByAdministrator));
  }

  changePassSubject(Subject: string, pass: string, passConfirm: string, passOld: string): Observable<Response> {
    return this.changepwdSubjectQry
      .mutate({
        id: Subject,
        password: pass,
        Password_confirm: passConfirm,
        Password_old: passOld,
      })
      .pipe(map(({ data }: any) => data.UpdatePasswordBySubject));
  }

  getSubjectsRolesBySubjectID(id: string): Observable<Response> {
    return this.getSubjectsRolesBySubjectIDQuery
      .watch({
        Subject_id: id,
      })
      .valueChanges.pipe(map(({ data }: any) => data.getSubjectsRolesBySubjectID));
  }

  createSubjectRoles(SubjectRole: SubjectRole): Observable<Response> {
    return this.createSubjectsRolesQuery
      .mutate({
        req: { data: SubjectRole },
      })
      .pipe(map(({ data }: any) => data.createSubjectsRoles));
  }

  deleteSubjectsRoles(id: string): Observable<Response> {
    return this.deleteSubjectsRolesQuery
      .mutate({
        id: id,
      })
      .pipe(map(({ data }: any) => data.deleteSubjectsRoles));
  }

  createSubjectsSecurityEntity(SubjectAttribute: NewSubjectSecurityEntity): Observable<Response> {
    return this.createSubjectsSecurityEntityQuery
      .mutate({
        request: { data: SubjectAttribute },
      })
      .pipe(map(({ data }: any) => data.createSubjectsSecurityEntity));
  }

  createSubjectsAttribute(SubjectAttribute: NewSubjectAttribute): Observable<Response> {
    return this.createSubjectsAttributeQuery
      .mutate({
        request: { data: SubjectAttribute },
      })
      .pipe(map(({ data }: any) => data.createSubjectsAttribute));
  }

  deleteSubjectsSecurityEntity(id: string): Observable<Response> {
    return this.deleteSubjectsSecurityEntityQuery
      .mutate({
        id: id,
      })
      .pipe(map(({ data }: any) => data.deleteSubjectsSecurityEntity));
  }

  deleteSubjectsAttributey(id: string): Observable<Response> {
    return this.deleteSubjectsAttributeyQuery
      .mutate({
        id: id,
      })
      .pipe(map(({ data }: any) => data.deleteSubjectsAttribute));
  }

  validateSubjectPassword(password: any) {
    const url = EnvServiceProvider.useFactory().REST_API + '/api/v1/auth/password-policy';
    return this._httpClient.post(url, password).pipe(map((res) => res));
  }

  public getSubjectFormSesStorage(): any {
    let Subject: any;
    const token = sessionStorage.getItem('Token');
    if (token) {
      Subject = helper.decodeToken(token);
    }
    return Subject;
  }

  getSubjectByName(Subject: any): Observable<Response> {
    return this.getSubjectQueryByName
      .mutate(
        Subject
      )
      .pipe(map(({ data }: any) => data.getSubjectByName));
  }

  activeSubject(id: string): Observable<Response> {
    return this.activeQuerySubject
      .mutate(
        {id}
      )
      .pipe(map(({ data }: any) => data.activeSubject));
  }

  public getSubjectAll() {
    const url = 'https://systemschoolramonv1.herokuapp.com/api/v1/subjects/all';
    return this._httpClient.get(url).pipe(map((res) => res));
  }
}
