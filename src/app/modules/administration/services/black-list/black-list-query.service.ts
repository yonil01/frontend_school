import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Mutation, Query } from 'apollo-angular';
import { Response } from '@app/core/models';

@Injectable({
  providedIn: 'root',
})
export class GetBlackListPwdQuery extends Query<Response> {
  document = gql`
    query getBlackListPwd {
      getBlackListPwd {
        error
        data {
          id
          password
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
export class CreateBlacklistPwd extends Mutation {
  document = gql`
    mutation createBlackListPwd($request: RequestNewBlackListPwd!) {
      createBlackListPwd(input: $request) {
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
export class DeleteBlacklistPwd extends Mutation {
  document = gql`
    mutation deleteBlackListPwd($id: Int!) {
      deleteBlackListPwd(id: $id) {
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
export class UpdateBlackListPwd extends Mutation {
  document = gql`
    mutation updateBlackListPwd($request: RequesUpdateBlackListPwd!) {
      updateBlackListPwd(input: $request) {
        error
        data {
          id
          password
        }
        code
        type
        msg
      }
    }
  `;
}
