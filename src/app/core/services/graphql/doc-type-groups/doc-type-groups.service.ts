import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
// import { GetDoctypeGroups } from 'core/models/getDoctypeGroups.model';
import { map } from 'rxjs/operators';
import { Response, Document, DocTypeGroups } from '@app/core/models';
import {
  GetDoctypeGroupsByDoctypeNameQuery,
  GetDoctypeFormatQuery,
  GetDoctypeDashBoardsQuery,
  GetDoctypeReportsQuery,
  PublishDoctypeQuery,
  GetDoctypeGroupsProjectRoleQuery,
  GetDocumentsByEntityValuesQuery,
  GetDoctypeByFormatAndProjectIDQuery, GetDoctypeGroupQuery,
} from '@app/core/services/graphql/doc-type-groups/doc-type-groups.query.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocTypeGroupsService {

  constructor(
    private getDoctypeGroupsByDoctypeNameQuery: GetDoctypeGroupsByDoctypeNameQuery,
    private getDoctypeFormatQuery: GetDoctypeFormatQuery,
    private getDoctypeDashBoardsQuery: GetDoctypeDashBoardsQuery,
    private getDoctypeReportsQuery: GetDoctypeReportsQuery,
    private publishDoctypeQuery: PublishDoctypeQuery,
    private getDoctypeGroupsProjectRoleQuery: GetDoctypeGroupsProjectRoleQuery,
    private getDocumentsByEntityValuesQuery: GetDocumentsByEntityValuesQuery,
    private getDoctypeByFormatAndProjectIDQuery: GetDoctypeByFormatAndProjectIDQuery,
    private getDoctypeGroupQuery: GetDoctypeGroupQuery,
  ) {}

  public getDocTypeGroups(): Observable<Response> {
    return this.getDoctypeGroupQuery.watch({}).valueChanges.pipe(map(({data}: any) => data.getDoctypeGroup));
  }

  searchDocuments(entities: any, typeDocument: any[]) {
    return this.getDocumentsByEntityValuesQuery
      .watch({
        entities: entities,
        doctypes: typeDocument,
      })
      .valueChanges.pipe(map(({ data }: any) => data.getDocumentsByEntityValues));
  }

  getDoctypeGroupsByDoctypeName(doctype: string): Observable<Response> {
    return this.getDoctypeGroupsByDoctypeNameQuery
      .watch({
        doctype: doctype,
      })
      .valueChanges.pipe(map(({ data }: any) => data.getDoctypeGroupsByDoctypeName));
  }

  getDoctypeFormat(): Observable<Response> {
    return this.getDoctypeFormatQuery.watch({}).valueChanges.pipe(map(({ data }: any) => data.getDoctypeFormat));
  }

  getDoctypesByFormatAnfProjectID(format: string, project_id: string): Observable<Response> {
    return this.getDoctypeByFormatAndProjectIDQuery.watch({format, project_id}).valueChanges.pipe(map(({ data }: any) => data.getDoctypeByFormatAndProjectID));
  }

  getDoctypeDashBoards(): Observable<Response> {
    return this.getDoctypeDashBoardsQuery
      .watch({})
      .valueChanges.pipe(map(({ data }: any) => data.getDoctypeDashBoards));
  }

  getDoctypeReports(): Observable<Response> {
    return this.getDoctypeReportsQuery.watch({}).valueChanges.pipe(map(({ data }: any) => data.getDoctypeReports));
  }

  setPublishDoctype(doctype_id: string, procedure: string): Observable<Response> {
    return this.publishDoctypeQuery
      .mutate({
        doctype_id: doctype_id,
        procedure: procedure,
      })
      .pipe(map(({ data }: any) => data.publishDoctype));
  }

  getDoctypeGroupsProjectRole(): Observable<Response> {
    return this.getDoctypeGroupsProjectRoleQuery
      .watch({})
      .valueChanges.pipe(map(({ data }: any) => data.getDoctypeGroupsProjectRole));
  }
}
