import {DataDrop, DropdownModel} from "ecapture-ng-ui/lib/modules/dropdown/models/dropdown";

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
