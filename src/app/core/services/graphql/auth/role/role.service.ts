import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Response} from '@app/core/models';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(
    private apollo: Apollo,
  ) {}

  getRoles(): Observable<Response> {
    return this.apollo
      .watchQuery({
        query: gql`
          query getRoles {
            getRoles {
              data {
                id
                name
              }
            }
          }
        `,
      })
      .valueChanges.pipe(map(({data}: any) => data.getRoles));
  }
}
