import {TableModel} from "@app/ui/components/table/model/table.model";

export const styleTableEntitySegurity: TableModel = {
  type: 2,
  columns: [
    {
      label: 'Entidad',
    },
    {
      label: 'Valor',
    },
    {
      label: 'Options',
    },
  ],
  dataSources: [],
  optionsStander: [
    {
      icon: 'delete 32',
      color: 'text-mono-70',
      visibility: true,
      type: 'Delete'
    },
  ],
  optionMax: [
    {
      icon: 'delete 32',
      color: 'text-alert-error',
      visibility: true,
      type: 'Delete Max'
    },
  ]
}

export const styleDropdown: any = {
  textColor: 'text-mono-70',
  container: {
    background: 'bg-mono-10',
    border: {
      color: '',
      size: '',
      round: 'rounded-md',
      style: '',
      hover: ''
    }
  },
  optionContainer: {
    background: 'bg-mono-10',
    border: {
      color: 'border-red-70',
      size: 'border-2',
      round: 'rounded-md',
      style: '',
      hover: 'bg-white'
    }
  },
}

