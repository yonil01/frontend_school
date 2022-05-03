import {TableModel} from "@app/ui/components/table/model/table.model";

export const styleTableTimer: TableModel = {
  columns: [
    {
      label: 'Nombre',
    },
    {
      label: 'Tipo',
    },
    {
      label: 'Frecuencia',
    },
    {
      label: 'Dia de la semana',
    },
    {
      label: 'Dia del mes',
    },
    {
      label: 'Fecha Inicio',
    },
    {
      label: 'Fecha Fin',
    },
    {
      label: 'Opciones',
    },
  ],
  buttonTittle: {
    showButton: true,
    label: 'Crear Temporizador',
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
      icon: 'delete 32',
      color: 'text-alert-error',
      visibility: true,
      type: 'delete'
    },

  ],
}
