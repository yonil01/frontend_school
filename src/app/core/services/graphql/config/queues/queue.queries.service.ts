import {Injectable} from '@angular/core';
import gql from 'graphql-tag';
import {Mutation, Query} from 'apollo-angular';
import {Response} from '@app/core/models';

@Injectable({
  providedIn: 'root',
})
export class GetQueue extends Query<Response> {
  document = gql`
    query getTimer {
  getTimer {
    error
    data {
      id
      name
      type
      frequency
      day_of_month
    }
    code
    msg
  }
}
  `;
}
