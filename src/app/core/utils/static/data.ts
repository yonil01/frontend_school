import {CountryModel} from "@app/core/models/country/country";
import {DropdownModel} from "ecapture-ng-ui";

export const dataCountries: CountryModel[] = [
  {
    country: 'Colombia',
    departments: [
      {
        department: 'Antioquia',
        cities: [
          {
            city: 'Caceres',
          },
          {
            city: 'Caucasia',
          },
          {
            city: 'Bello',
          },
          {
            city: 'Medellín',
          },
        ],
      },
      {
        department: 'Bogota D.C.',
        cities: [
          {
            city: 'Bogotá',
          },
        ],
      },
      {
        department: 'Boyaca',
        cities: [
          {
            city: 'Tunja',
          },
          {
            city: 'Jenesano',
          },
          {
            city: 'Chiquinquira',
          },
          {
            city: 'Ramiriquí',
          },
        ],
      },
      {
        department: 'Cundinamarca',
        cities: [
          {
            city: 'Soacha',
          },
          {
            city: 'Mosquera',
          },
          {
            city: 'Zipaquira',
          },
        ],
      },
    ],
  },
  {
    country: 'Ecuador',
    departments: [
      {
        department: 'Azuay',
        cities: [
          {
            city: 'Cuenca',
          },
          {
            city: 'Cuenca',
          },
          {
            city: 'Cuenca',
          },
        ],
      },
      {
        department: 'Bolivar',
        cities: [
          {
            city: 'Guaranda',
          },
          {
            city: 'Guaranda',
          },
          {
            city: 'Guaranda',
          },
        ],
      },
      {
        department: 'Pichincha',
        cities: [
          {
            city: 'Quito',
          },
          {
            city: 'Quito',
          },
          {
            city: 'Quito',
          },
        ],
      },
    ],
  },

  {
    country: 'España',
    departments: [
      {
        department: 'Alava',
        cities: [
          {
            city: 'Vitoria',
          },
          {
            city: 'Vitoria',
          },
          {
            city: 'Vitoria',
          },
        ],
      },
      {
        department: 'Albacete',
        cities: [
          {
            city: 'Albacete',
          },
          {
            city: 'Albacete',
          },
          {
            city: 'Albacete',
          },
        ],
      },
      {
        department: 'Madrid',
        cities: [
          {
            city: 'Madrid',
          },
        ],
      },
    ],
  },
];

export const dropDownStyle: DropdownModel = {
  textColor: 'text-black',
  container: {
    background: 'bg-mono-10 border-2 rounded',
    border: {
      color: 'border-mono-10',
      size: 'border-4',
      round: 'rounded-lg',
      style: 'border-solid',
      hover: 'border-mono-30'
    }
  },
  optionContainer: {
    background: 'bg-mono-10 rounded border-2 border-mono-30',
    border: {
      color: 'border-mono-30',
      size: 'border-2',
      round: 'rounded',
      style: 'border-solid',
      hover: 'bg-mono-30'
    }
  },
};

export const ExcelType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

export const colors: string[] = [
  'rgba(0,75,122,0.3)', 'rgba(0,0,255,0.3)',
  '#3377FF', '#FF666E',
  '#2ABB54', '#6699FF',
  'rgba(122, 0, 245, 1)', 'rgba(159, 163, 173, 1)',
  '#DA1E28', '#CC8700',
  '#00131F', '#0071B8',
  '#0071B8', '#595B5D',
  'rgba(255, 177, 26, 1)', 'rgba(31, 255, 255, 1)'
];

export const formatAllowed = 'image/*, .pdf, .mp4, .mp3, .doc, .docx, .xls, .xlxs, .msg'

export const regexDoc = /.*([/|.|\w|\s|-])*\/(?:msword)/
export const regexXls = /.*([/|.|\w|\s|-])*\/(?:vnd.ms-excel)/
export const regexDocx = /.*([/|.|\w|\s|-])*\/(?:vnd.openxmlformats-officedocument.wordprocessingml.document)/
export const regexXlsx = /.*([/|.|\w|\s|-])*\/(?:vnd.openxmlformats-officedocument.spreadsheetml.sheet)/
export const regexOutlook = /.*([/|.|\w|\s|-])*\/(?:vnd.ms-outlook)/
export const regexPdf   = /.*([/|.|\w|\s|-])*\/(?:pdf)/
export const regexJpg   = /.*(image)*\/(?:jpg)/
export const regexJpeg  = /.*(image)*\/(?:jpeg)/
export const regexGif   = /.*(image)*\/(?:gif)/
export const regexPng   = /.*(image)*\/(?:png)/
export const regexSvg   = /.*(image)*\/(?:svg)/
export const regexBpmn  = /.*(image)*\/(?:bpmn)/
export const regexTif   = /.*(image)*\/(?:tiff)/
export const regexImg   = /.*(image)*\/(?:jpg|jpeg|gif|png|svg|bpmn)/
export const regexVideo = /.*([/|.|\w|\s|-])*\/(?:mp4)/
export const regexMedia = /.*([/|.|\w|\s|-])*\/(?:mpeg)/

export const unSupportedFormatViewers = [
  { name: 'doc', format: regexDoc },
  { name: 'docx', format: regexDocx },
  { name: 'xls', format: regexXls },
  { name: 'xlsx', format: regexXlsx },
]
export const supportedFormats = [
  { extension: 'docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', typeRegex: regexDocx },
  { extension: 'doc',  type: 'application/msword', typeRegex: regexDoc },
  { extension: 'xls',  type: 'application/vnd.ms-excel', typeRegex: regexXls },
  { extension: 'xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', typeRegex: regexXlsx },
  { extension: 'msg',  type: 'application/vnd.ms-outlook', typeRegex: regexOutlook }, // 'application/octet-stream'
  { extension: 'pdf',  type: 'application/pdf', typeRegex: regexPdf },
  { extension: 'jpg',  type: 'image/jpg',  typeRegex: regexJpg },
  { extension: 'jpeg', type: 'image/jpeg', typeRegex: regexJpeg },
  { extension: 'gif',  type: 'image/gif',  typeRegex: regexGif },
  { extension: 'png',  type: 'image/png',  typeRegex: regexPng },
  { extension: 'svg',  type: 'image/svg',  typeRegex: regexSvg },
  { extension: 'bpmn', type: 'image/bpmn', typeRegex: regexBpmn },
  { extension: 'tif',  type: 'image/tiff', typeRegex: regexTif },
  { extension: 'mp4',  type: 'video/mp4', typeRegex: regexVideo },
  { extension: 'mp3',  type: 'audio/mpeg', typeRegex: regexMedia },
]


