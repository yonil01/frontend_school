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
export class GetCustomersQuery extends Query<ResponseGetCustomers> {
  document = gql`
    query getCustomer {
      getCustomer {
        error
        code
        data {
          id
          name
          nit
          country
          city
          address
          phone
          email
          projects {
            id
            name
            description
            department
            email
            phone
            product_owner
            customers_id
          }
        }
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private getCustomersQuery: GetCustomersQuery) {}
  getCustomers(): Observable<Response> {
    return this.getCustomersQuery
      .watch({
        errorPolicy: 'all',
      })
      .valueChanges.pipe(map(({ data }: any) => data.getCustomer));
  }
}
