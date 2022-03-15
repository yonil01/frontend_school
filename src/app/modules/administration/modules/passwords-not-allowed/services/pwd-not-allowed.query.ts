import {Inject, Injectable, Injector} from "@angular/core";
import {Mutation, Query} from "apollo-angular";
import gql from "graphql-tag";
import {compileInjectable} from "@angular/compiler";

@Injectable({
  providedIn:'root'
})
export  class GetPwdNotAllowed extends Query<Response>{
  document = gql`
      query getBlackListPwd{
      getBlackListPwd{
        error
        data {
          id
          password
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
  providedIn:'root'
})

export class CreateBlackListPwd extends Mutation{
  document =gql`
  mutation createBlackListPwd($rq:RequestNewBlackListPwd) {
  createBlackListPwd (input:$rq){
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
  providedIn:'root'
})
export class DeleteBlackListPwd extends Mutation {
  document =gql`
  mutation deleteBlackListPwd($rq:Int!) {
  deleteBlackListPwd (id:$rq){
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
  providedIn: 'root'
})
export class UpdateBlackListPwd extends Mutation {
  document =gql`
  mutation updateBlackListPwd($rq:RequesUpdateBlackListPwd!) {
  updateBlackListPwd (input:$rq){
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
