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
    route: 'dynamic-forms',
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

export const formatsDocs = [
  {label: 'dcs', value: 'dcs'},
  {label: 'frm', value: 'frm'},
  {label: 'wkf', value: 'wkf'},
  {label: 'tif', value: 'tif'},
  {label: 'jpg', value: 'jpg'},
  {label: 'png', value: 'png'},
  {label: 'pdf', value: 'pdf'},
  {label: 'doc', value: 'doc'},
  {label: 'sys', value: 'sys'},
  {label: 'dsb', value: 'dsb'},
  {label: 'vsr', value: 'vsr'},
  {label: 'tpl', value: 'tpl'},
  {label: 'rpt', value: 'rpt'},
];

export const typeSupport = [
  {label: 'Electrónico', value: 'E'},
  {label: 'Físico', value: 'F'},
];

export const dispositionFinal = [
  {label: 'Conservación Total', value: 'CT'},
  {label: 'Microfilmación', value: 'M'},
  {label: 'Digitalización', value: 'D'},
  {label: 'Eliminar', value: 'E'},
];

export const typesQueues = {
  'bpmn:SendTask': 1,
  'bpmn:ReceiveTask': 2,
  'bpmn:UserTask': 3,
  'bpmn:ManualTask': 4,
  'bpmn:BusinessRuleTask': 5,
  'bpmn:ServiceTask': 6,
  'bpmn:ScriptTask': 7,
  'bpmn:IntermediateCatchEvent': 8,
  'bpmn:ExclusiveGateway': 9,
  'bpmn:ParallelGateway': 10,
  'bpmn:InclusiveGateway': 11,
  'bpmn:ComplexGateway': 12,
  'bpmn:EventBasedGateway': 13,
};

export const typeTimes = [
  {value: 1, label: 'Notificar solicitud recibida'},
  {value: 2, label: 'Crear template'},
  {value: 3, label: 'Completitud documental'},
  {value: 5, label: 'Timer Execution'},
  {value: 35, label: 'Timer Execution daily'}
];

export const typeTasks = [
  {value: 1, label: 'Sistema'},
  {value: 2, label: 'Timer'},
  {value: 3, label: 'Usuario'}
];
