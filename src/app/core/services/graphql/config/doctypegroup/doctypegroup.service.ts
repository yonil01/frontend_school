import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DoctypegroupService {
  constructor(private apollo: Apollo) {}

  getDocTG() {
    return this.apollo
      .watchQuery({
        query: gql`
          query getDoctypeGroups {
            getDoctypeGroups {
              data {
                id
                project
                doc_types {
                  name
                }
              }
            }
          }
        `,
      })
      .valueChanges.pipe(map(({ data }: any) => data.getDoctypeGroups));
  }
}
