import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Mutation, Query } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class GetAllMsgs extends Query<Response> {
  document = gql`
  query getMsgs {
    getMessage {
      error
      data {
        id
        spa
        eng
        type_message
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
export class CreateMsg extends Mutation<Response> {
  document = gql`
  mutation createMsg($req: RequestNewMessage!) {
    createMessage(input: $req) {
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
export class DeleteMsg extends Mutation<Response> {
  document = gql`
  mutation deleteMsg($id: Int!) {
    deleteMessage(id: $id) {
      error
      data {
        id
        spa
        eng
        type_message
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
export class UpdateMsg extends Mutation<Response> {
  document = gql`
  mutation updateMsg($request: RequestUpdateMessage!) {
    updateMessage(input: $request) {
      error
      data {
        id
        spa
        eng
        type_message
      }
      code
      type
      msg
    }
  }
  `;
}
