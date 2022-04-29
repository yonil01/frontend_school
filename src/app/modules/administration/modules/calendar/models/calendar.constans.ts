import {StatusPage} from "@app/modules/administration/modules/calendar/models/calendary.model";
import {DataDrop, DropdownModel} from "ecapture-ng-ui/lib/modules/dropdown/models/dropdown";
import {ItemSelectList} from "@app/ui/components/list-select/models/list-select.model";

export const showStatusPage: StatusPage[] = [
  {
    name: 'main',
    show: true,
  },
  {
    name: 'register-calendar',
    show: false,
  },
  {
    name: 'setting-calendar',
    show: false,
  },
]


export const dropStyle: DropdownModel = {
  container: {
    background: 'bg-mono-10',
    border: {
      color: 'border-mono-10',
      size: 'border-4',
      round: 'rounded-lg',
      style: 'border-solid',
      hover: 'border-mono-30'
    }
  },
  optionContainer: {
    background: 'bg-mono-10',
    border: {
      color: 'border-mono-30',
      size: 'border-2',
      round: 'rounded',
      style: 'border-solid pl-2',
      hover: 'bg-mono-30'
    }
  },
  textColor: 'text-black'
};

export const dataWeek: DataDrop[] = [
  {
    label: 'Lunes',
    value: 1
  },
  {
    label: 'Martes',
    value: 2
  },
  {
    label: 'Miercoles',
    value: 3
  },
  {
    label: 'Jueves',
    value: 4
  },{
    label: 'Viernes',
    value: 5
  },
  {
    label: 'Sabado',
    value: 6
  },
  {
    label: 'Domingo',
    value: 7
  },
]


export const styleSelectList: ItemSelectList[] = [
  {
    title: 'Horario',
    subTitle: 'Horario de trabajo de la semana',
    columns: [
      {
        label: 'Nombre',
      },
      {
        label: 'Fecha inicio',
      },
      {
        label: 'Fecha Fin',
      },
      {
        label: 'Numero de dias',
      },
      {
        label: 'Opciones',
      },
    ],
    dataSource: [],
    options: [
      {
        icon: 'edit',
        color: 'text-brand-2',
        visibility: true,
        type: 'edit',
      },
      {
        icon: 'delete 32',
        color: 'text-alert-error',
        visibility: true,
        type: 'delete'
      },

    ],
  },
  {
    title: 'Festivo',
    subTitle: 'Horario de festivo',
    columns: [
      {
        label: 'Nombre',
      },
      {
        label: 'Fecha Festivo',
      },
      {
        label: 'Hora inicio',
      },
      {
        label: 'Hora Fin',
      },
      {
        label: 'Estado',
      },
      {
        label: 'Opciones',
      },
    ],
    dataSource: [],
    options: [
      {
        icon: 'edit',
        color: 'text-brand-2',
        visibility: true,
        type: 'edit',
      },
      {
        icon: 'delete 32',
        color: 'text-alert-error',
        visibility: true,
        type: 'delete'
      },

    ],
  }
]
export const Days = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado","Domingo"];
export const Month = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];


