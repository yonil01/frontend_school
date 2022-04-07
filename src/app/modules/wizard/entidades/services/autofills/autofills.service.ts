import { Injectable } from '@angular/core';
import {
  GetAutofillsQuery,
  CreateAutofillsQuery,
  UpdateAutofillsQuery,
  GetAllAutofillValuesQuery,
  GetAutofillsByEntityIDQuery,
  DeleteAutofillsQuery,
  CreateAttributeAutofillQuery,
  GetAttributeAutofillsByAutofillIDQuery,
  DeleteAttributeAutofillQuery,
  CreateAutofillValueQuery,
  UpdateAutofillValueQuery,
  DeleteAutofillValueQuery,
  GetAutofillByValueQuery,
} from './autofills.queries.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {AttributeAutofill, Autofill, AutofillsValues, Response} from "@app/core/models";

@Injectable({
  providedIn: 'root',
})
export class AutofillsService {
  constructor(
    private getAutofillsQuery: GetAutofillsQuery,
    private createAutofillsQuery: CreateAutofillsQuery,
    private updateAutofillsQuery: UpdateAutofillsQuery,
    private getAllAutofillValuesQuery: GetAllAutofillValuesQuery,
    private getAutofillsByEntityIDQuery: GetAutofillsByEntityIDQuery,
    private deleteAutofillsQuery: DeleteAutofillsQuery,
    private createAttributeAutofillQuery: CreateAttributeAutofillQuery,
    private getAttributeAutofillsByAutofillIDQuery: GetAttributeAutofillsByAutofillIDQuery,
    private deleteAttributeAutofillQuery: DeleteAttributeAutofillQuery,
    private createAutofillValueQuery: CreateAutofillValueQuery,
    private updateAutofillValueQuery: UpdateAutofillValueQuery,
    private deleteAutofillValueQuery: DeleteAutofillValueQuery,
    private getAutofillByValueQuery: GetAutofillByValueQuery,
  ) {}

  getAutofills(): Observable<Response> {
    return this.getAutofillsQuery.watch({}).valueChanges.pipe(map(({ data }: any) => data.getAutofills));
  }

  getAutofillsByEntityID(id: string): Observable<Response> {
    return this.getAutofillsByEntityIDQuery
      .watch({ id: id })
      .valueChanges.pipe(map(({ data }: any) => data.getAutofillsByEntityID));
  }

  createAutofills(autofill: Autofill): Observable<Response> {
    return this.createAutofillsQuery
      .mutate({
        request: { data: autofill },
      })
      .pipe(map(({ data }: any) => data.createAutofills));
  }

  updateAutofills(autofill: Autofill): Observable<Response> {
    return this.updateAutofillsQuery
      .mutate({
        request: { data: autofill },
      })
      .pipe(map(({ data }: any) => data.updateAutofills));
  }

  deleteAutofills(id: string): Observable<Response> {
    return this.deleteAutofillsQuery
      .mutate({
        id: id,
      })
      .pipe(map(({ data }: any) => data.deleteAutofills));
  }

  createAttributeAutofill(attributeAutofill: AttributeAutofill): Observable<Response> {
    return this.createAttributeAutofillQuery
      .mutate({
        request: {
          data: attributeAutofill,
        },
      })
      .pipe(map(({ data }: any) => data.createAttributeAutofill));
  }

  getAllAutofillValues(id: string): Observable<Response> {
    return this.getAllAutofillValuesQuery
      .watch({ id: id })
      .valueChanges.pipe(map(({ data }: any) => data.getAllAutofillValues));
  }

  getAttributeAutofillsByAutofillID(id: string): Observable<Response> {
    return this.getAttributeAutofillsByAutofillIDQuery
      .watch({ id: id })
      .valueChanges.pipe(map(({ data }: any) => data.getAttributeAutofillsByAutofillID));
  }

  deleteAttributeAutofill(id: string): Observable<Response> {
    return this.deleteAttributeAutofillQuery
      .mutate({ id: id })
      .pipe(map(({ data }: any) => data.deleteAttributeAutofill));
  }

  createAutofillValue(autofillsValues: AutofillsValues): Observable<Response> {
    return this.createAutofillValueQuery
      .mutate({ request: { data: autofillsValues } })
      .pipe(map(({ data }: any) => data.createAutofillValue));
  }

  updateAutofillValue(autofillsValues: AutofillsValues): Observable<Response> {
    return this.updateAutofillValueQuery
      .mutate({ request: { data: autofillsValues } })
      .pipe(map(({ data }: any) => data.updateAutofillValue));
  }

  deleteAutofillValue(id: number, autofill_ad: string): Observable<Response> {
    return this.deleteAutofillValueQuery
      .mutate({ id: id, autofill_ad: autofill_ad })
      .pipe(map(({ data }: any) => data.deleteAutofillValue));
  }

  getAutofillByValue(autofill_id: string, entity_id: string, dataParam: any): Observable<Response> {
    return this.getAutofillByValueQuery
      .watch({ autofill_id: autofill_id, entity_id: entity_id, data: dataParam})
      .valueChanges.pipe(map(({ data }: any) => data.getAutofillByValue));
  }
}
