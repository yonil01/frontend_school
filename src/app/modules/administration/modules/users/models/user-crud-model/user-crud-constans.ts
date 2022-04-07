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
      index: 2,
      title: 'Roles',
      status: 'Pending',
      block: true,
      focus: false,
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

export const userSelect: User = {
  id:"d07409e5-1278-40f9-8790-d568a4af7fe4",
  username:"adminpbonos",
  name:"Admin",
  last_name:"Pruebas",
  email_notifications:"gustavo.vega@e-capture.co",
  identification_number:"71240639",
  identification_type:"C",
  status:1,
  roles:[
    {
      id:"7af27dfc-06be-4782-a5f4-d52f5183c121",
      name:"administradorBonos",
      role_allow: {}
    }
  ],
  security_entities:[
    {
      id:"d1112ff8-b968-48ae-8f24-472d2fbf7d94",
      entity:{
        id:"fa407640-97c8-4666-8ec4-e5b52059dfb7",
        name:"informacio_basica_fiduciaria"
      },
      attributes:[
        {
          id:"4f003857-e079-4b34-adf9-1eb716e5f2b4",
          value:"123",
          enable:true,
          attribute:{
            id:"eb9d0a76-3092-49e7-b27e-c1f7835b18af",
            name:"rnc"
          }
        }
      ]
    }
  ],
  created_at:"2021-02-01T15:05:15Z"
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


