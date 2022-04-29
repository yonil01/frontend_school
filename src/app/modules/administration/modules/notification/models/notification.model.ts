import {TableModel} from "@app/ui/components/table/model/table.model";

export const styleTableNotification: TableModel = {
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
  buttonTittle: {
    showButton: true,
    label: 'Crear Notificación',
    route: ''
  },
  isSearch: true,
  dataSource: [
    {
      value1: 'Nueva',
      value2: 'yonil.rojas@e-capture.co',
      value3: 'yonil.rojas@e-capture.co',
      value4: 'yonil.rojas@e-capture.co'
    }
  ],
  optionsStander: [
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



