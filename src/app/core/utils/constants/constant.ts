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
    id: 'a10016f7-3421-49e4-8d91-b613a00decf6',
    name: 'Entidades',
    icon: '../../../assets/img/entities-icon.svg',
    description: 'Presione aquí para configurar lo correspondiente a entidades.',
    route: 'entities',
  },
  {
    id: '8e142376-b331-4255-a87a-60cb80141464',
    name: 'Documentos',
    icon: '../../../assets/img/documents-icon.svg',
    description: 'Presione aquí para configurar lo correspondiente a documentos.',
    route: 'documents',
  },
  {
    id: '889dc0f4-99cb-4f7c-9e51-f37f8134a010',
    name: 'Formularios',
    icon: '../../../assets/img/forms-icon.svg',
    description: 'Presione aquí para configurar lo correspondiente a formularios.',
    route: 'dynamic-forms',
  },
  {
    id: 'b7fe79fa-aad4-4c8c-89ab-8fdc04e42b02',
    name: 'BPMN',
    icon: '../../../assets/img/bpmns-icon.svg',
    description: 'Presione aquí para configurar lo correspondiente a procesos.',
    route: 'bpmn',
  },
  {
    id: 'a5f4dff3-6d1a-4ac2-bc8f-398cb2367ec8',
    name: 'Roles',
    icon: '../../../assets/img/roles-icon.svg',
    description: 'Presione aquí para configurar lo correspondiente a roles.',
    route: 'roles',
  },
  {
    id: '20426141-b9e6-4e83-801e-070543af71c7',
    name: 'Almacenamiento físico',
    icon: '../../../assets/img/storages-icon.svg',
    description: 'Presione aquí para configurar lo correspondiente a almacenamiento físico.',
    route: 'roles',
  }
]

export const AdminElement = [
  {
    id: '84c729c0-66a1-4213-b2f8-5c0b58a7ece2',
    name: 'Usuarios',
    route: 'user',
  },
  {
    id: 'd65d7929-7fa5-492a-974f-82ceb729290d',
    name: 'Contraseñas no permitidas',
    route: 'password-not-allowed',
  },
  {
    id: '21f8ceca-cfb7-442f-8142-fa700b115ce0',
    name: 'Mensajes',
    route: 'message',
  },
  {
    id: '1e7a7280-57d8-4e4c-b852-04ab9e5bdb22',
    name: 'Conjunto de datos',
    route: 'datasets',
  },
  {
    id: '4cdef85f-b613-4b46-83c0-3ae05135adb9',
    name: 'Calendarios',
    route: 'calendar',
  },
  {
    id: '53a63ec4-9b22-4805-b8d9-2b0b1f38fc04',
    name: 'Notificaciones',
    route: 'notification',
  },
  {
    id: '82ea97f3-82e4-4681-b993-185a7f1f277f',
    name: 'Temporizadores',
    route: 'timer',
  },
  {
    id: 'e75161d2-033e-4e54-9991-c05b2366636d',
    name: 'Consola Diagnóstivo Worker',
    route: 'console_notification',
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
  {label: 'trg', value: 'trg'},//formato para manuales
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
  {value: 1, label: 'System'},
  {value: 2, label: 'Timer'},
  {value: 3, label: 'User'}
];
