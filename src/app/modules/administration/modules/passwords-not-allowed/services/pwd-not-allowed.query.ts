import {Inject, Injectable, Injector} from "@angular/core";
import {Mutation, Query} from "apollo-angular";
import gql from "graphql-tag";

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

export class CreateBlackListPwd extends Mutation<Response>{
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
