import {Injectable} from "@angular/core";
import {Mutation, Query} from "apollo-angular";
import gql from "graphql-tag";

@Injectable(
  {
    providedIn:"root"
  }
)
export class GetParameters extends Query<Response>{
  document = gql`
  query getParameter{
  getParameter{
    error
    data {
      id
      name
      value
      type
      description
      client_id
      is_cipher
      created_at
      updated_at
    }
    code
    type
    msg

  }
}

  `;
}

@Injectable(
  {
    providedIn:"root"
  }
)
export class CreateParameter extends Mutation{
  document = gql`
  mutation createParameter($rq:RequestNewParameter!) {
  createParameter(input:$rq){
    error
    data {
       id
      name
      value
      type
      description
      client_id
      is_cipher
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
export class DeleteParameterQuery extends Mutation {
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
          name
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

