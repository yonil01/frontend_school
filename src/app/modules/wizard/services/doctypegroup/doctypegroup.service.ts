import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {DocTypeGroups, DocTypes, DoctypeEntities, Response} from '@app/core/models';
import {Observable} from 'rxjs';
import {
  CreateDoctypeGroupQuery,
  UpdateDoctypeGroupQuery,
  DeleteDoctypeGroupsMutation,
  GetDoctypeGroupsProjectQuery,
  GetDoctypeGroupsByProjectIDQuery,
  GetStorageQuery,
  CreateDoctypeMutation,
  UpdateDoctypeMutation,
  DeleteDoctypeMutation,
  QueryGetMaxCodDoctype,
  GetEntitiesByIDQuery,
  CreateDoctypeEntitiesMutation,
  DeleteDoctypeEntitiesByDtIDMutation, DeleteDoctypeEntitiesById, GetDoctypeByIDQuery, GetDoctypeQuery
} from '../doctypegroup/doctypegroup.queries.service';

@Injectable({
  providedIn: 'root'
})

export class DoctypegroupService {
  constructor(
    private createDoctypeGroupQuery: CreateDoctypeGroupQuery,
    private updateDoctypeGroupQuery: UpdateDoctypeGroupQuery,
    private deleteDoctypeGroupsMutation: DeleteDoctypeGroupsMutation,
    private getDoctypeGroupsProjectQuery: GetDoctypeGroupsProjectQuery,
    private getDoctypeGroupsByProjectIDQuery: GetDoctypeGroupsByProjectIDQuery,
    private getStorageQuery: GetStorageQuery,
    private createDoctypeMutation: CreateDoctypeMutation,
    private updateDoctypeMutation: UpdateDoctypeMutation,
    private deleteDoctypeMutation: DeleteDoctypeMutation,
    private queryGetMaxCodDoctype: QueryGetMaxCodDoctype,
    private getEntitiesByIDQuery: GetEntitiesByIDQuery,
    private createDoctypeEntitiesMutation: CreateDoctypeEntitiesMutation,
    private deleteDoctypeEntitiesByDtIDMutation: DeleteDoctypeEntitiesByDtIDMutation,
    private deleteDoctypeEntitiesByIdMutation: DeleteDoctypeEntitiesById,
    private getDoctypeByIDQuery: GetDoctypeByIDQuery,
    private getDoctypeQuery: GetDoctypeQuery
  ) {
  }

  public createDoctypeGroup(doctypegroup: DocTypeGroups): Observable<Response> {
    return this.createDoctypeGroupQuery.mutate({rq: {data: doctypegroup}}).pipe(map(({data}: any) => data.createDoctypeGroup));
  }

  public updateDoctypeGroup(doctypegroup: DocTypeGroups): Observable<Response> {
    return this.updateDoctypeGroupQuery.mutate({rq: {data: doctypegroup}}).pipe(map(({data}: any) => data.updateDoctypeGroup));
  }

  public deleteDoctypeGroup(id: string): Observable<Response> {
    return this.deleteDoctypeGroupsMutation.mutate({rq: id}).pipe(map(({data}: any) => data.deleteDoctypeGroup));
  }

  public createDoctype(doctype: DocTypes): Observable<Response> {
    return this.createDoctypeMutation.mutate({rq: {data: doctype}}).pipe(map(({data}: any) => data.createDoctype));
  }

  public updateDoctype(doctype: DocTypes): Observable<Response> {
    return this.updateDoctypeMutation.mutate({rq: {data: doctype}}).pipe(map(({data}: any) => data.updateDoctype));
  }

  deleteDoctype(id: string): Observable<Response> {
    return this.deleteDoctypeMutation.mutate({id: id}).pipe(map(({data}: any) => data.deleteDoctype));
  }

  public createDoctypeEntities(doctypeEntities: DoctypeEntities[]): Observable<Response> {
    return this.createDoctypeEntitiesMutation.mutate({rq: {data: doctypeEntities}}).pipe(map(({data}: any) => data.createDoctypesEntities));
  }

  public deleteDoctypeEntities(doctypeId: string, entityID: string): Observable<Response> {
    return this.deleteDoctypeEntitiesByDtIDMutation
      .mutate({
        doctype_id: doctypeId,
        entity_id: entityID
      })
      .pipe(map(({data}: any) => data.deleteDoctypeEntitiesByDtID));
  }

  public deleteDoctypeEntitiesById(id: string): Observable<Response> {
    return this.deleteDoctypeEntitiesByIdMutation.mutate({id}).pipe(map(({data}: any) => data.deleteDoctypeEntities));
  }

  public getMaxCodDoctype(): Observable<Response> {
    return this.queryGetMaxCodDoctype
      .watch()
      .valueChanges.pipe(map(({data}: any) => data.getMaxCodDoctype));
  }

  public getStorage(): Observable<Response> {
    return this.getStorageQuery
      .watch()
      .valueChanges.pipe(map(({data}: any) => data.getStorage));
  }

  public getEntitiesByID(id: string): Observable<Response> {
    return this.getEntitiesByIDQuery
      .watch({
        id,
      })
      .valueChanges.pipe(map(({data}: any) => data.getEntitiesByID));
  }

  public getDoctypeGroupsProject(): Observable<Response> {
    return this.getDoctypeGroupsProjectQuery
      .watch()
      .valueChanges.pipe(map(({data}: any) => data.getDoctypeGroupsProject));
  }

  public getDoctypeGroupsByProjectID(project_id: string): Observable<Response> {
    return this.getDoctypeGroupsByProjectIDQuery
      .watch({
        project_id
      })
      .valueChanges.pipe(map(({data}: any) => data.getDoctypeGroupsByProjectID));
  }

  public getRequiredByDoctypeID(id: string): Observable<Response> {
    return this.getDoctypeByIDQuery
      .watch({
        id
      })
      .valueChanges.pipe(map(({data}: any) => data.getDoctypeByID));
  }

  public getAllDoctype(): Observable<Response> {
    return this.getDoctypeQuery
      .watch()
      .valueChanges.pipe(map(({data}: any) => data.getDoctype));
  }

}


