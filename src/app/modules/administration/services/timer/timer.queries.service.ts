import {Injectable} from "@angular/core";
import {Mutation, Query} from "apollo-angular";
import gql from "graphql-tag";

@Injectable({
  providedIn: 'root',
})
export class CreateTimer extends Mutation {
  document = gql`
    mutation createTimer($rq: RequestNewTimer!) {
      createTimer(input: $rq) {
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
export class GetTimer extends Query {
  document = gql`
    query getTimer {
  getTimer {
    error
    data {
      id
      name
      type
      frequency
      day_of_week
      day_of_month
      begin_at
      end_at
      created_at
    }
    code
    msg
  }
}
  `;
}

@Injectable({
  providedIn: 'root',
})
export class DeleteTimer extends Mutation {
  document = gql`
   mutation deleteTimer($id: ID!) {
  deleteTimer(id: $id) {
    error
    data {
      id
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
export class UpdateTimer extends Mutation {
  document = gql`
    mutation updateTimer($rq: RequestUpdateTimer!) {
  updateTimer(input: $rq) {
    error
    code
    data {
      id
      name
    }
    type
    msg
  }
}
  `;
}



