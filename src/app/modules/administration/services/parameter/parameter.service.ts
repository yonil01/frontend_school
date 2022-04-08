import { Injectable } from '@angular/core';
import { Response, Parameter } from '@app/core/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// Clases querys
import {
  GetParameterQuery,
  CreateParameter,
  UpdateParameter,
  DeleteParameter,
} from './parameter.query.service';

@Injectable({
  providedIn: 'root',
})
export class ParameterService {
  constructor(
    private getParameterQuery: GetParameterQuery,
    private createParameterQry: CreateParameter,
    private updateParameterQry: UpdateParameter,
    private deleteParameterQry: DeleteParameter,
  ) {}

  getParameters(): Observable<Response> {
    return this.getParameterQuery.watch({}).valueChanges.pipe(map(({ data }: any) => data.getParameter));
  }

  createParameter(list: Parameter): Observable<Response> {
    return this.createParameterQry
      .mutate({
        req: { data: list },
      })
      .pipe(map(({ data }: any) => data.createParameter));
  }

  updateParameters(list: Parameter): Observable<Response> {
    return this.updateParameterQry
      .mutate({
        req: { data: list },
      })
      .pipe(map(({ data }: any) => data.updateParameter));
  }

  deleteParameter(idx: string): Observable<Response> {
    return this.deleteParameterQry
      .mutate({
        id: idx,
      })
      .pipe(map(({ data }: any) => data.deleteParameter));
  }
}
