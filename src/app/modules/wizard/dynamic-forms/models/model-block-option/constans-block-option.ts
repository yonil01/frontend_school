import {data} from "autoprefixer";

export interface FileManagerModel {
  folder: folder[]
}

export interface folder {
  documents: document[];
  option: option;
  display: boolean;
}

export interface option {
  name: string;
  textColor: string;
  icon: string;
  iconColor: string;
  show: boolean;
  disabled: boolean;
}

export interface document {
  option: option;
}



export const dataModelFileManager: FileManagerModel =  {
  folder: [
    {
      option: {
        name: 'Layout',
        textColor: 'text-black',
        icon: 'desktop 32',
        iconColor: 'text-blue-600',
        show: false,
        disabled: true,
      },
      display: true,
      documents: [
        {
          option: {
            name: 'Main',
            textColor: 'text-black',
            icon: 'slide-transition 32',
            iconColor: 'text-blue-600',
            show: false,
            disabled: false,
          }
        },
        {
          option: {
            name: 'Step Vertical',
            textColor: 'text-black',
            icon: 'text-list 32',
            iconColor: 'text-blue-600',
            show: false,
            disabled: true,
          }
        },
        {
          option: {
            name: 'Step Horizontal',
            textColor: 'text-black',
            icon: 'text-list 32',
            iconColor: 'text-blue-600',
            show: false,
            disabled: true,
          }
        }
      ]
    },
    {
      option: {
        name: 'Basic',
        textColor: 'text-black',
        icon: 'desktop 32',
        iconColor: 'text-blue-600',
        show: false,
        disabled: false,
      },
      display: false,
      documents: [
        {
          option: {
            name: 'Imagen',
            textColor: 'text-black',
            icon: 'slide-transition 32',
            iconColor: 'text-blue-600',
            show: false,
            disabled: true,
          }
        },
        {
          option: {
            name: 'Texto',
            textColor: 'text-black',
            icon: 'text-list 32',
            iconColor: 'text-blue-600',
            show: false,
            disabled: true,
          }
        },
        {
          option: {
              name: 'Linea',
            textColor: 'text-black',
            icon: 'text-list 32',
            iconColor: 'text-blue-600',
            show: false,
            disabled: true,
          }
        },
        {
          option: {
            name: 'Step item',
            textColor: 'text-black',
            icon: 'text-list 32',
            iconColor: 'text-blue-600',
            show: false,
            disabled: true,
          }
        },
        {
          option: {
            name: 'Text Field',
            textColor: 'text-black',
            icon: 'text-list 32',
            iconColor: 'text-blue-600',
            show: false,
            disabled: true,
          }
        },
        {
          option: {
            name: 'Number',
            textColor: 'text-black',
            icon: 'text-list 32',
            iconColor: 'text-blue-600',
            show: false,
            disabled: true,
          }
        },
        {
          option: {
            name: 'Password',
            textColor: 'text-black',
            icon: 'text-list 32',
            iconColor: 'text-blue-600',
            show: false,
            disabled: true,
          }
        },
        {
          option: {
            name: 'Checkbox',
            textColor: 'text-black',
            icon: 'text-list 32',
            iconColor: 'text-blue-600',
            show: false,
            disabled: true,
          }
        },
        {
          option: {
            name: 'Radio',
            textColor: 'text-black',
            icon: 'text-list 32',
            iconColor: 'text-blue-600',
            show: false,
            disabled: true,
          }
        },
        {
          option: {
            name: 'Button',
            textColor: 'text-black',
            icon: 'text-list 32',
            iconColor: 'text-blue-600',
            show: false,
            disabled: true,
          }
        },
        {
          option: {
            name: 'Document ID',
            textColor: 'text-black',
            icon: 'text-list 32',
            iconColor: 'text-blue-600',
            show: false,
            disabled: true,
          }
        },
      ]
    },
    {
      option: {
        name: 'Entidad Simple',
        textColor: 'text-black',
        icon: 'desktop 32',
        iconColor: 'text-blue-600',
        show: false,
        disabled: false,
      },
      display: false,
      documents: [
        {
          option: {
            name: 'Solicitud',
            textColor: 'text-black',
            icon: 'slide-transition 32',
            iconColor: 'text-blue-600',
            show: false,
            disabled: true,
          }
        },
        {
          option: {
            name: 'Fidecomiso',
            textColor: 'text-black',
            icon: 'text-list 32',
            iconColor: 'text-blue-600',
            show: false,
            disabled: true,
          }
        },
        {
          option: {
            name: 'Suplidor',
            textColor: 'text-black',
            icon: 'text-list 32',
            iconColor: 'text-blue-600',
            show: false,
            disabled: true,
          }
        },
        {
          option: {
            name: 'Forma de pago',
            textColor: 'text-black',
            icon: 'text-list 32',
            iconColor: 'text-blue-600',
            show: false,
            disabled: true,
          }
        },
        {
          option: {
            name: 'Bancaria',
            textColor: 'text-black',
            icon: 'text-list 32',
            iconColor: 'text-blue-600',
            show: false,
            disabled: true,
          }
        },
        {
          option: {
            name: 'Datos Personales',
            textColor: 'text-black',
            icon: 'text-list 32',
            iconColor: 'text-blue-600',
            show: false,
            disabled: true,
          }
        },
        {
          option: {
            name: 'Contacto',
            textColor: 'text-black',
            icon: 'text-list 32',
            iconColor: 'text-blue-600',
            show: false,
            disabled: true,
          }
        },
        {
          option: {
            name: 'Comercial',
            textColor: 'text-black',
            icon: 'text-list 32',
            iconColor: 'text-blue-600',
            show: false,
            disabled: true,
          }
        },
      ]
    },
    {
      option: {
        name: 'Entidad Multiple',
        textColor: 'text-black',
        icon: 'desktop 32',
        iconColor: 'text-blue-600',
        show: false,
        disabled: false,
      },
      display: false,
      documents: [
        {
          option: {
            name: 'Datos del Pago',
            textColor: 'text-black',
            icon: 'slide-transition 32',
            iconColor: 'text-blue-600',
            show: false,
            disabled: true,
          }
        },
        {
          option: {
            name: 'Process Control',
            textColor: 'text-black',
            icon: 'text-list 32',
            iconColor: 'text-blue-600',
            show: false,
            disabled: true,
          }
        }
      ]
    },
  ]
}



