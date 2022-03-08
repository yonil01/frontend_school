import { Injectable } from '@angular/core';
import { Query, Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root',
})
export class GetParameterQuery extends Query<Response> {
  document = gql`
    query getParameter {
      getParameter {
        error
        data {
          id
          name
          value
          description
          client_id
          is_cipher
          type
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
export class CreateParameter extends Mutation {
  document = gql`
    mutation createParameter($req: RequestNewParameter!) {
      createParameter(input: $req) {
        error
        code
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class UpdateParameter extends Mutation {
  document = gql`
    mutation updateParameter($req: RequestUpdateParameter!) {
      updateParameter(input: $req) {
        error
        data {
          id
          value
          description
          client_id
          is_cipher
          type
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
export class DeleteParameter extends Mutation {
  document = gql`
    mutation deleteParameter($id: Int!) {
      deleteParameter(id: $id) {
        error
        data {
          id
          value
          description
          client_id
        }
        code
        type
        msg
      }
    }
  `;
}
