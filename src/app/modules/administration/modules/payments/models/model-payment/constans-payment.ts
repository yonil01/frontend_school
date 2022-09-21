import {TableModel} from "@app/ui/components/table/model/table.model";
import {DataContentPayment} from "@app/modules/administration/modules/payments/models/model-payment/model-payment";


export const styleTablePayment: TableModel = {
  columns: [
    {
      label: 'Nombre',
    },
    {
      label: 'Descripcion',
    },
    {
      label: 'Motivo',
    },
    {
      label: 'Estado',
    },
    {
      label: 'Fecha',
    },
    {
      label: 'Usuario',
    },
    {
      label: 'Monto',
    },
    {
      label: 'Rol',
    },
    {
      label: 'Opciones',
    },
  ],
  buttonTittle: {
    showButton: true,
    label: 'Crear Usuario',
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

export const dataContent: DataContentPayment[] = [
  {
    name: 'list-Payment',
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

