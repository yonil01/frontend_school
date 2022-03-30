import {TableModel} from "@app/ui/components/table/model/table.model";

export const styleTableEntitySegurity: TableModel = {
  type: 2,
  columns: [
    {
      label: 'Formulario',
    },
    {
      label: 'Options',
    },
  ],
  dataSources: [
    {
      title: 'Informacion fidecomiso',
      datasource: [
        {
          name: 'primero'
        },
        {
          name: 'primero'
        },
        {
          name: 'primero'
        }
      ]

    },
    {
      title: 'Informacion Basica',
      datasource: [
        {
          name: 'primero'
        },
        {
          name: 'primero'
        },
        {
          name: 'primero'
        }
      ]

    }
  ],
  options: [
    {
      icon: 'delete 32',
      color: 'text-gray-400',
      visibility: true,
      type: 'normally'
    },
  ],
  optionMax: [
    {
      icon: 'delete 32',
      color: 'text-alert-error',
      visibility: true,
      type: 'normally'
    },
  ]
}
