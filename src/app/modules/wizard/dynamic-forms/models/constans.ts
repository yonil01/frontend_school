import {TableModel} from "@app/ui/components/table/model/table.model";
import {Doctype} from "@angular/compiler/src/i18n/serializers/xml_helper";

export const styleTableFirst: TableModel = {
  columns: [
    {
      label: 'Formulario',
    },
    {
      label: 'Opciones',
    }
  ],
  dataSource: [

  ],
  options: [
    {
      icon: 'broad-activity-feed',
      color: 'text-alert-success',
      visibility: true,
      type: 'normally'
    },
  ]
}


export const styleTableForms: TableModel = {
  columns: [
    {
      label: 'Formulario',
    },
    {
      label: 'Opciones',
    }
  ],
  buttonTittle: {
    showButton: true,
    label: 'Crear Contenedor',
    route: '/wizard/dymanic-forms/create'
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
      icon: 'delete 32',
      color: 'text-alert-error',
      visibility: true,
      type: 'delete',
    },
    {
      icon: 'web-asset 32',
      color: 'text-alert-success',
      visibility: true,
      type: 'normally'
    },
  ]
}

