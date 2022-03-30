import {StepModel} from "@app/ui/components/step/models/step-vertical-model";
import {User} from "@app/core/models";


export const CrudModel: StepModel = {
  style: {
    size: "w-1/2"
  },
  dataSourceStep: [
    {
      index: 1,
      title: 'Información Basica',
      status: 'Active',
    },
    {
      index: 2,
      title: 'Roles',
      status: 'Pending'
    },
    {
      index: 3,
      title: 'Entidad de Seguridad',
      status: 'Pending'
    },
  ]
}

export const userSelect: User = {
  id: "25c59a3b-7f3f-4dcd-b7fd-a4a7071d57f1",
  username: "manager",
  name: "manager",
  last_name: "manager",
  email_notifications: "jguerrero@e-capture.co",
  identification_number: "80188284",
  identification_type: "C",
  status: 0,
  roles: [
    {
      id: "38856274-5311-4173-97d1-fb7e2c8c9e16",
      name: "root",
      role_allow: {}
    }
  ],
  security_entities: [],
  created_at: "2020-08-17T09:09:10Z"
}
