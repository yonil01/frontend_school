import {Injectable} from "@angular/core";
import {Mutation, Query} from "apollo-angular";
import gql from "graphql-tag";

@Injectable({
  providedIn: 'root',
})
export class CreateCalendar extends Mutation {
  document = gql`
    mutation createCalendars($rq: RequestNewCalendar!) {
  createCalendars(input: $rq) {
    error
    code
    data{
      id
      name
      start_date
      end_date
      created_at
      updated_at
      id_user
    }
    type
    msg
  }
}

  `;
}


@Injectable({
  providedIn: 'root',
})
export class GetCalendars extends Query {
  document = gql`
    query getCalendar {
  getCalendar {
    error
    data {
      id
      name
      start_date
      end_date
      calendar_working_days_weeks{
        name
      }
      calendar_holidays{
        name
      }
      id_user
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
export class DeleteCalendar extends Mutation {
  document = gql`
   mutation deleteCalendars($id: ID!) {
  deleteCalendars(id: $id) {
    error
    data {
      id
      name
      start_date
      end_date
      calendar_working_days_weeks{
        id
        name
        day_number
        start_time
        end_time
        calendar_id
        id_user
        created_at
        updated_at
      }
      calendar_holidays{
        id
        name
        holiday_date
        start_time
        end_time
        status_holiday_id
        calendar_id
        id_user
        created_at
        updated_at
      }
      id_user
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
export class UpdateCalendar extends Mutation {
  document = gql`
   mutation updateCalendars($rq: RequestUpdateCalendar!) {
  updateCalendars(input: $rq) {
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
