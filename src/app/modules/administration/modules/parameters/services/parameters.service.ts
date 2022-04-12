import {Injectable} from '@angular/core';
import {
  CreateParameter,
  DeleteParameterQuery,
  GetParameters, UpdateParameter
} from "@app/modules/administration/modules/parameters/services/parameters.query";
import {Observable} from "rxjs";
import {
  Parameters, ResponseCreateParameter, ResponseDeleteParameter,
  ResponseGetParameters
} from "@app/modules/administration/modules/parameters/models/parameters.models";
import {map} from "rxjs/operators";
import {data} from "autoprefixer";
import {Parameter, Response} from "@app/core/models";

@Injectable({
  providedIn: 'root'
})
export class ParametersService {

  constructor(
    private getParameterQuery: GetParameters,
    private createParameterMutation: CreateParameter,
    private deleteParameterQuery: DeleteParameterQuery,
    private updateParameterQry: UpdateParameter
  ) {
  }

  public getParameters(): Observable<ResponseGetParameters> {
    return this.getParameterQuery.watch().valueChanges.pipe(map(({data}: any) => data.getParameter));
  }
  public createParameter(parameter: Parameters): Observable<ResponseCreateParameter> {
    return this.createParameterMutation.mutate({
      rq: {
        data: parameter
      }
    }).pipe(map(({data}: any) => data.createParameter));
  }

  public deleteParameter(id: number): Observable<ResponseDeleteParameter> {
    return this.deleteParameterQuery.mutate({
      id
    }).pipe(map(({data}: any) => data.deleteParameter));
  }

  public updateParameters(parameter: Parameters): Observable<Response> {
    return this.updateParameterQry
      .mutate({
        req: { data: parameter },
      })
      .pipe(map(({ data }: any) => data.updateParameter));
  }
}





