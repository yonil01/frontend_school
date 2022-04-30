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


@Injectable({
  providedIn: 'root',
})
export class CreateCalendarWorkingDaysWeeks extends Mutation {
  document = gql`
    mutation createCalendarWorkingDaysWeeks($rq: RequestNewCalendarWorkingDaysWeeks!) {
  createCalendarWorkingDaysWeeks(input: $rq) {
    error
    code
    data{
      id
      name
      day_number
      start_time
      end_time
      calendar_id
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
export class DeleteCalendarWorkingDaysWeeks extends Mutation {
  document = gql`
   mutation deleteCalendarWorkingDaysWeeks($id: ID!) {
  deleteCalendarWorkingDaysWeeks(id: $id) {
    error
    data {
      id
      name
      day_number
      start_time
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
export class UpdateCalendarWorkingDaysWeeks extends Mutation {
  document = gql`
  mutation updateCalendarWorkingDaysWeeks($rq: RequestUpdateCalendarWorkingDaysWeeks!) {
  updateCalendarWorkingDaysWeeks(input: $rq) {
    error
    code
    data {
      id
      name
      day_number
      start_time
      end_time
      calendar_id
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
export class CreateCalendarHoliday extends Mutation {
  document = gql`
   mutation createCalendarHoliday($rq: RequestNewCalendarHoliday!) {
  createCalendarHoliday(input: $rq) {
    error
    code
    data {
      id
      name
      holiday_date
      start_time
      end_time
      calendar_id
      status_holiday_id
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
export class DeleteCalendarHoliday extends Mutation {
  document = gql`
   mutation deleteCalendarHoliday($id: ID!) {
  deleteCalendarHoliday(id: $id) {
    error
    data {
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
export class UpdateCalendarHoliday extends Mutation {
  document = gql`
  mutation updateCalendarHoliday($rq: RequestUpdateCalendarHoliday!) {
  updateCalendarHoliday(input: $rq) {
    error
    code
    data {
      id
      name
      holiday_date
      start_time
      end_time
      status_holiday_id
      calendar_id
      id_user
      updated_at
    }
    type
    msg
  }
}

  `;
}
