export const dataStepProcess = [
  {
    title: 'Información General',
    active: true,
    next_step: 'Tipos Documentales',
  },
  {
    title: 'Información General',
    active: false,
    next_step: 'Tipos Documentales',
  },
  {
    title: 'Información General',
    active: false,
    next_step: 'Tipos Documentales',
  }
];

export const ConfigElement = [
  {
    name: 'Entidades',
    icon: '../../../assets/img/entities-icon.svg',
    description: 'Presione aquí para configurar lo correspondiente a entidades.',
    route: 'entities',
  },
  {
    name: 'Documentos',
    icon: '../../../assets/img/documents-icon.svg',
    description: 'Presione aquí para configurar lo correspondiente a documentos.',
    route: 'documents',
  },
  {
    name: 'Formularios',
    icon: '../../../assets/img/forms-icon.svg',
    description: 'Presione aquí para configurar lo correspondiente a formularios.',
    route: 'dymanic-forms',
  },
  {
    name: 'BPMN',
    icon: '../../../assets/img/bpmns-icon.svg',
    description: 'Presione aquí para configurar lo correspondiente a procesos.',
    route: 'bpmn',
  },
  {
    name: 'Roles',
    icon: '../../../assets/img/roles-icon.svg',
    description: 'Presione aquí para configurar lo correspondiente a roles.',
    route: 'roles',
  },
  {
    name: 'Almacenamiento físico',
    icon: '../../../assets/img/storages-icon.svg',
    description: 'Presione aquí para configurar lo correspondiente a almacenamiento físico.',
    route: 'roles',
  }
]
