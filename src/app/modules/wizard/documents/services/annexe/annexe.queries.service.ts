import {Injectable} from '@angular/core';
import gql from 'graphql-tag';
import {Mutation, Query} from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class CreateRequiredQuery extends Mutation {
  document = gql`
    mutation createRequired($requestRequired: RequestNewRequired!) {
      createRequired(input: $requestRequired) {
        error
        data {
          id
        }
        code
        type
        msg
      }
    }
  `;
}
