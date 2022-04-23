import {Injectable} from "@angular/core";
import {Mutation, Query} from "apollo-angular";
import gql from "graphql-tag";

@Injectable(
  {
    providedIn:"root"
  }
)
export class GetWhiteList extends Query<Response> {
  document = gql`
    query getWhiteList{
  getWhiteList{
    error
    data {
     id
     ip
     description
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
export class CreateWhiteList extends Mutation{
  document = gql`
     mutation createWhiteList($rq:RequestNewWhiteList!) {
  createWhiteList(input:$rq){
    error
    data {
     id
     ip
     description
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


@Injectable({
  providedIn: 'root',
})
export class DeleteWhiteListQuery extends Mutation {
  document = gql`
    mutation deleteWhiteList($id: Int!){
  deleteWhiteList(id: $id){
    error
    data {
     id
     ip
     description
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

@Injectable({
  providedIn: 'root',
})
export class UpdateWhiteList extends Mutation {
  document = gql`
    mutation updateWhiteList($req: RequesUpdateWhiteList!) {
      updateWhiteList(input: $req) {
    error
    data {
     id
     ip
     description
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


