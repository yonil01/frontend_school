import {TableModel} from "@app/ui/components/table/model/table.model";

export const styleTableCalendar: TableModel = {
  columns: [
    {
      label: 'Nombre',
    },
    {
      label: 'Fecha Inicio',
    },
    {
      label: 'Fecha Final',
    },
    {
      label: 'Opciones',
    }
  ],
  buttonTittle: {
    showButton: true,
    label: 'Crear Calendario',
    route: ''
  },
  isSearch: true,
  dataSource: [],
  optionsStander: [
    {
      icon: 'edit',
      color: 'text-brand-2',
      visibility: true,
      type: 'edit',
    },
    {
      icon: 'setting 32',
      color: 'text-alert-warning',
      visibility: true,
      type: 'setting',
    },
    {
      icon: 'delete 32',
      color: 'text-alert-error',
      visibility: true,
      type: 'delete'
    },

  ],
}

export interface StatusPage {
  name: string,
  show: boolean;
}

export interface CalendarWorkingDayWeek {
    id: string,
    name: string,
    day_number: number,
    start_time: string,
    end_time: string,
    calendar_id: string,
  }

export interface CalendarHolidays {
  id?: string,
  name?: string,
  holiday_date?: string,
  start_time?: string,
  end_time?: string,
  status_holiday_id?: number,
  calendar_id?: string,
}
