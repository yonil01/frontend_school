import {StepModel} from "@app/ui/components/step/models/step-vertical-model";
import {User} from "@app/core/models";
import {DataDrop} from "ecapture-ng-ui/lib/modules/dropdown/models/dropdown";


export const CrudModel: StepModel = {
  style: {
    size: "w-1/2"
  },
  dataSourceStep: [
    {
      index: 1,
      title: 'Información Basica',
      status: 'Pending',
      block: false,
      focus: true,
    },
    {
      index: 3,
      title: 'Entidad de Seguridad',
      status: 'Pending',
      block: true,
      focus: false,
    },
  ]
}

export const Teacherelect: User = {
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

export const typesIdentification: DataDrop[] = [
  { label: 'Cédula de ciudadania', value: 'C' },
  { label: 'Cédula de extranjería', value: 'E' },
  { label: 'Pasaporte', value: 'P' },
  { label: 'Acta de nacimiento', value: 'R' },
  { label: 'Carnet diplomático', value: 'D' },
  { label: 'RNC', value: 'A' },
  { label: 'Otros', value: 'O' },
];


