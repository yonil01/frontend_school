import {TableModel} from "@app/ui/components/table/model/table.model";
import {DataContentUser} from "@app/modules/administration/modules/users/models/model-user/model-user";


export const styleTableUser: TableModel = {
  columns: [
    {
      label: 'Dni',
    },
    {
      label: 'Username',
    },
    {
      label: 'Nombres',
    },
    {
      label: 'Apellidos',
    },
    {
      label: 'Sexo',
    },
    {
      label: 'Correo',
    },
    {
      label: 'Opciones',
    }
  ],
  buttonTittle: {
    showButton: true,
    label: 'Crear Alumno',
    route: ''
  },
  isSearch: true,
  dataSource: [],
  optionsStander: [
    {
      icon: 'edit',
      color: 'text-alert-info',
      visibility: true,
      type: 'edit',
    },
    {
      icon: 'lock 32',
      color: 'text-alert-info',
      visibility: true,
      type: 'lock',
    },
    {
      icon: 'key 32',
      color: 'text-alert-warning',
      visibility: true,
      type: 'update-password'
    },
    {
      icon: 'delete 32',
      color: 'text-alert-error',
      visibility: true,
      type: 'delete'
    },
  ],
}

export const dataContent: DataContentUser[] = [
  {
    name: 'list-user',
    status: true,
  },
  {
    name: 'crud',
    status: false,
  },
  {
    name: 'change-password',
    status: false,
  }
]

export const showLoader: any =   [
    {
    value: false
    }
  ]

export const showToast: any = [
  {
    type: 'error',
    show: true,
    msg: 'Error'
  }
]

