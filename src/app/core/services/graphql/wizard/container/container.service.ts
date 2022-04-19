import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Query } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { Customer, Response } from '@app/core/models';
import { Observable } from 'rxjs';

export interface ResponseGetCustomers {
  data: Customer[];
}

@Injectable({
  providedIn: 'root',
})
export class NewContainer extends Query<ResponseGetCustomers> {
  document = gql`
    mutation createContainerForm($rq:RequestNewContainerForm!) {
  createContainerForm(input:$rq) {
    error
    data {
      id
      name
      position_id
      parent_id
      style_css
      created_at
      updated_at
    }
    code
    type
    msg
  }
}
  `;
}

@Injectable({
  providedIn: 'root',
})
export class ContainerService {
  constructor(private createContainer: NewContainer) {}
  newContainer(id: string, name: string, position_id: number, container_id: number, parent_id: number, style_css: string, doctype_id: number): Observable<Response> {
    return this.createContainer.watch({rq: {data :{id, name, position_id, container_id, parent_id, style_css, doctype_id}}}).valueChanges.pipe(map(({ data }: any) => data.getDoctypeByFormatAndProjectID));
  }

}
