import {
  CalendarHolidays,
  CalendarWorkingDayWeek
} from "@app/modules/administration/modules/calendar/models/calendary.model";

export interface Calendar {
  id?: string,
  name?: string,
  start_date?: Date,
  end_date?: Date,
  created_at?: string,
  updated_at?: string,
  user_id?: string,
  calendar_working_days_weeks?: CalendarWorkingDayWeek[],
  calendar_holidays?: CalendarHolidays[],
}
