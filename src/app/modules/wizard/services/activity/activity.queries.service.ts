import {Injectable} from '@angular/core';
import gql from 'graphql-tag';
import {Query} from 'apollo-angular';
import {Response} from '@app/core/models';

@Injectable({
  providedIn: 'root',
})
export class GetActivitiesQuery extends Query<Response> {
  document = gql`
    query getActivities {
      getActivities {
        error
        data {
          id
          name
          description
          itemtype_id
          status
          parameters {
          type_param
            id
            name
            type
            list
            label
            activities_id
          }
        }
        code
        type
        msg
      }
    }
  `;
}
