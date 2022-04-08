import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Mutation, Query } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class GetWhiteListQuery extends Query<Response> {
  document = gql`
    query getWhiteList {
      getWhiteList {
        error
        data {
          id
          ip
          description
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
export class CreateWhitelistQuery extends Mutation {
  document = gql`
    mutation createWhitelist($request: RequestNewWhiteList!) {
      createWhiteList(input: $request) {
        error
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
export class DeleteIpQuery extends Mutation {
  document = gql`
    mutation deleteWhiteList($id: Int!) {
      deleteWhiteList(id: $id) {
        error
        data {
          id
          description
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
export class UpdateWhiteListQuery extends Mutation {
  document = gql`
    mutation updateWhiteList($request: RequesUpdateWhiteList!) {
      updateWhiteList(input: $request) {
        error
        data {
          id
          ip
          description
        }
        code
        type
        msg
      }
    }
  `;
}
