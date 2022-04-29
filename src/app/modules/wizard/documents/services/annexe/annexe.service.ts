import {Injectable} from '@angular/core';
import {Entity, Response} from "@app/core/models";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {
  CreateRequiredAttributes,
  CreateRequiredDoctypes,
  CreateRequiredMutation, DeleteRequiredAttributes,
  DeleteRequiredDoctypes,
  DeleteRequiredMutation, UpdateRequiredAttributes,
  UpdateRequiredDoctypes,
  UpdateRequiredMutation
} from "@app/modules/wizard/documents/services/annexe/annexe.queries.service";
import {
  AnnexeAttributesRequestModel,
  AnnexeDoctypesRequestModel,
  AnnexeRequestModel
} from "@app/core/models/config/annexe";

@Injectable({
  providedIn: 'root'
})
export class AnnexeService {

  constructor(private createRequiredMutation: CreateRequiredMutation,
              private updateRequiredMutation: UpdateRequiredMutation,
              private deleteRequiredMutation: DeleteRequiredMutation,
              private createRequiredDoctypesMutation: CreateRequiredDoctypes,
              private updateRequiredDoctypesMutation: UpdateRequiredDoctypes,
              private deleteRequiredDoctypesMutation: DeleteRequiredDoctypes,
              private createRequiredAttributesMutation: CreateRequiredAttributes,
              private updateRequiredAttributesMutation: UpdateRequiredAttributes,
              private deleteRequiredAttributesMutation: DeleteRequiredAttributes) {
  }

  public createRequired(annexe: AnnexeRequestModel): Observable<Response> {
    return this.createRequiredMutation
      .mutate({
        requestRequired: {data: annexe},
      })
      .pipe(map(({data}: any) => data.createRequired));
  }

  public updateRequired(annexe: AnnexeRequestModel): Observable<Response> {
    return this.updateRequiredMutation
      .mutate({
        requestUpdateRequired: {data: annexe},
      })
      .pipe(map(({data}: any) => data.updateRequired));
  }

  public deleteRequired(id: string): Observable<Response> {
    return this.deleteRequiredMutation
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => data.deleteRequired));
  }

  public createRequiredDoctype(doctype: AnnexeDoctypesRequestModel): Observable<Response> {
    return this.createRequiredDoctypesMutation
      .mutate({
        requestRequiredDoctypes: {data: doctype},
      })
      .pipe(map(({data}: any) => data.createRequiredDoctypes));
  }

  public updateRequiredDoctype(doctype: AnnexeDoctypesRequestModel): Observable<Response> {
    return this.updateRequiredDoctypesMutation
      .mutate({
        requestUpdateRequiredDoctypes: {data: doctype},
      })
      .pipe(map(({data}: any) => data.updateRequiredDoctypes));
  }

  public deleteRequiredDoctype(id: string): Observable<Response> {
    return this.deleteRequiredDoctypesMutation
      .mutate({
        id: {data: id},
      })
      .pipe(map(({data}: any) => data.deleteRequiredDoctypes));
  }

  public createRequiredAttribute(attribute: AnnexeAttributesRequestModel): Observable<Response> {
    return this.createRequiredAttributesMutation
      .mutate({
        requestRequiredAttribute: {data: attribute},
      })
      .pipe(map(({data}: any) => data.createRequiredAttributes));
  }

  public updateRequiredAttribute(attribute: AnnexeAttributesRequestModel): Observable<Response> {
    return this.updateRequiredAttributesMutation
      .mutate({
        requestUpdateRequiredAttribute: {data: attribute},
      })
      .pipe(map(({data}: any) => data.updateRequiredAttributes));
  }

  public deleteRequiredAttribute(id: string): Observable<Response> {
    return this.deleteRequiredAttributesMutation
      .mutate({
        id: {data: id},
      })
      .pipe(map(({data}: any) => data.deleteRequiredDoctypes));
  }

}
