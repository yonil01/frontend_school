import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Mutation, Query } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class CreateNet extends Mutation {
  document = gql`
  mutation createNet($req: RequestNewNet!) {
    createNet(input: $req) {
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
export class UpdateNet extends Mutation {
  document = gql`
    mutation updateNet($request: RequesUpdateNet!) {
      updateNet(input: $request) {
        error
        data {
          id
          server
          ip
          port
          path
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
export class DeleteNet extends Mutation {
  document = gql`
    mutation deleteNet($id: Int!) {
      deleteNet(id: $id) {
        error
        data {
          id
          server
          ip
          port
          path
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
export class Getnet extends Query<Response> {
  document = gql`
  query getNets {
    getNet {
      error
      data {
        id
        server
        ip
        port
        path
      }
      code
      type
      msg
    }
  }
  `;
}
