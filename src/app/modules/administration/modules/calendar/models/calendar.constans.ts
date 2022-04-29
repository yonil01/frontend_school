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
    value: 'Monday'
  },
  {
    label: 'Martes',
    value: 'Tuesday'
  },
  {
    label: 'Miercoles',
    value: 'Wednesday'
  },
  {
    label: 'Jueves',
    value: 'Thursday'
  },{
    label: 'Viernes',
    value: 'Friday'
  },
  {
    label: 'Sabado',
    value: 'Saturday'
  },
  {
    label: 'Domingo',
    value: 'Sunday'
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
        label: 'Remitente',
      },
      {
        label: 'Destino',
      },
      {
        label: 'Template',
      },
      {
        label: 'Url Pop',
      },
      {
        label: 'Timer',
      },
      {
        label: 'Email',
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
    title: 'Horario',
    subTitle: 'Horario de trabajo de la semana',
    columns: [
      {
        label: 'Nombre',
      },
      {
        label: 'Remitente',
      },
      {
        label: 'Destino',
      },
      {
        label: 'Template',
      },
      {
        label: 'Url Pop',
      },
      {
        label: 'Timer',
      },
      {
        label: 'Email',
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
