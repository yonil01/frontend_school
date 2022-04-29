import {Injectable} from "@angular/core";
import {Mutation, Query} from "apollo-angular";
import gql from "graphql-tag";

@Injectable({
  providedIn: 'root',
})
export class CreateNotification extends Mutation {
  document = gql`
    mutation createNotification($rq: RequestNewNotification!) {
      createNotification(input: $rq) {
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
export class GetNotifications extends Query {
  document = gql`
    query getNotifications {
  getNotifications {
    error
    data {
      id
      name
      email_from
      template
      email_to
      url_pop
      timer_id
      subject_email
      created_at
      updated_at
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
export class DeleteNotification extends Mutation {
  document = gql`
   mutation deleteNotification($id: ID!) {
  deleteNotification(id: $id) {
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
export class UpdateNotification extends Mutation {
  document = gql`
   mutation updateNotification($rq: RequestUpdateNotification!) {
  updateNotification(input: $rq) {
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
