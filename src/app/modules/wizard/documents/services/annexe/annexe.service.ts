import {Injectable} from '@angular/core';
import {Entity, Response, ResponseAnnexe, ResponseAnnexeDoctype} from "@app/core/models";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {
  CreateRequiredAttributes, CreateRequiredAttributesCommon,
  CreateRequiredDoctypes,
  CreateRequiredMutation, DeleteRequiredAttributes, DeleteRequiredAttributesCommon,
  DeleteRequiredDoctypes,
  DeleteRequiredMutation, UpdateRequiredAttributes, UpdateRequiredAttributesCommon,
  UpdateRequiredDoctypes,
  UpdateRequiredMutation
} from "@app/modules/wizard/documents/services/annexe/annexe.queries.service";
import {
  AnnexeDoctypesRequestModel,
  AnnexeRequestModel,
  RequiredAttributeCommon, RequiredAttributeCommonRequestModel,
  RequiredAttributeRequestModel
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
              private createRequiredAttributesCommonMutation: CreateRequiredAttributesCommon,
              private updateRequiredAttributesCommonMutation: UpdateRequiredAttributesCommon,
              private deleteRequiredAttributesCommonMutation: DeleteRequiredAttributesCommon,
              private createRequiredAttributesMutation: CreateRequiredAttributes,
              private updateRequiredAttributesMutation: UpdateRequiredAttributes,
              private deleteRequiredAttributesMutation: DeleteRequiredAttributes) {
  }

  public createRequired(annexe: AnnexeRequestModel): Observable<ResponseAnnexe> {
    return this.createRequiredMutation
      .mutate({
        requestRequired: {data: annexe},
      })
      .pipe(map(({data}: any) => data.createRequired));
  }

  public updateRequired(annexe: AnnexeRequestModel): Observable<ResponseAnnexe> {
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

  public createRequiredDoctype(doctype: AnnexeDoctypesRequestModel): Observable<ResponseAnnexeDoctype> {
    return this.createRequiredDoctypesMutation
      .mutate({
        requestRequiredDoctypes: {data: doctype},
      })
      .pipe(map(({data}: any) => data.createRequiredDoctypes));
  }

  public updateRequiredDoctype(doctype: AnnexeDoctypesRequestModel): Observable<ResponseAnnexeDoctype> {
    return this.updateRequiredDoctypesMutation
      .mutate({
        requestUpdateRequiredDoctypes: {data: doctype},
      })
      .pipe(map(({data}: any) => data.updateRequiredDoctypes));
  }

  public deleteRequiredDoctype(id: string): Observable<Response> {
    return this.deleteRequiredDoctypesMutation
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => data.deleteRequiredDoctypes));
  }

  public createRequiredAttributeCommon(attribute: RequiredAttributeCommonRequestModel): Observable<Response> {
    return this.createRequiredAttributesCommonMutation
      .mutate({
        request: {data: attribute},
      })
      .pipe(map(({data}: any) => data.createRequiredAttributeCommon));
  }

  public updateRequiredAttributeCommon(attribute: RequiredAttributeCommon): Observable<Response> {
    return this.updateRequiredAttributesCommonMutation
      .mutate({
        request: {data: attribute},
      })
      .pipe(map(({data}: any) => data.updateRequiredAttributeCommons));
  }

  public deleteRequiredAttributeCommon(id: string): Observable<Response> {
    return this.deleteRequiredAttributesCommonMutation
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => data.deleteRequiredAttributeCommons));
  }

  public createRequiredAttribute(attribute: RequiredAttributeRequestModel): Observable<Response> {
    return this.createRequiredAttributesMutation
      .mutate({
        request: {data: attribute},
      })
      .pipe(map(({data}: any) => data.createRequiredAttributes));
  }

  public updateRequiredAttribute(attribute: RequiredAttributeRequestModel): Observable<Response> {
    return this.updateRequiredAttributesMutation
      .mutate({
        request: {data: attribute},
      })
      .pipe(map(({data}: any) => data.updateRequiredAttributes));
  }

  public deleteRequiredAttribute(id: string): Observable<Response> {
    return this.deleteRequiredAttributesMutation
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => data.deleteRequiredAttributes));
  }

}
