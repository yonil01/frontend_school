import { Injectable } from '@angular/core';
import { Query, Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root',
})
export class DoctypeQuery extends Query<Response> {
  document = gql`
    query getDoctypeGroups {
      getDoctypeGroups {
        error
        data {
          id
          project
          doc_types {
            code
            name
            url_path
            storage
            format
            auto_name
            type_support
            retention_electronic
            retention_ag
            retention_ac
            retention_ah
            final_disposition
            digitalization
            procedure
            class
            is_cipher
            entities {
              id
              is_unique
              attributes {
                id
                description
              }
            }
          }
          
        }
        code
        type
        msg
        token
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class CreateDoctypeGroupQuery extends Mutation {
  document = gql`
  mutation createDoctypeGroups ($rq: RequestDoctypeGroups!){
    createDoctypeGroups (input: $rq){
      error
      data{
        id
      }
      code
      type
      msg
      token
    }
  }
  `;
}
