export interface ModelListSelect  {
  status: boolean,
  value: ModelWorkingHours,
}

export interface ModelListSelectHoliday  {
  status: boolean,
  value: ModelDateHoliday,
}

export interface ModelWorkingHours {
  start_day: string,
  start_time: string,
  end_day: string,
  end_time: string,
}
export interface ModelDateHoliday {
  name: string,
  start_date: string,
  start_time: string,
  end_date: string,
  end_time: string,
}

export interface ChangeTab {
  label: string,
  status: boolean
}
