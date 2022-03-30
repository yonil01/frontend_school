import {TableModel} from "@app/ui/components/table/model/table.model";

export const styleTableUser: TableModel = {
  columns: [
    {
      label: 'N° de Identificación',
    },
    {
      label: 'Apellido y Nombre',
    },
    {
      label: 'Correo',
    },
    {
      label: 'Estado',
    },
    {
      label: 'Roles',
    },
    {
      label: 'Opciones',
    }
  ],
  buttonTittle: {
    showButton: true,
    label: 'Crear Usuario',
    route: '/admin/user/info-basic'
  },
  dataSource: [
  ],
  options: [
    {
      icon: 'edit',
      color: 'text-brand-2',
      visibility: true,
      type: 'edit',
    },
    {
      icon: 'lock 32',
      color: 'text-alert-error',
      visibility: true,
      type: 'delete',
    },
    {
      icon: 'key 32',
      color: 'text-alert-warning',
      visibility: true,
      type: 'normally'
    },
    {
      icon: 'delete 32',
      color: 'text-alert-success',
      visibility: true,
      type: 'normally'
    },
  ],
}
