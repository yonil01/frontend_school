export interface TableStander {

}



export interface TableModel {
  type?: number;
  isSearch?: boolean;
  buttonTittle?: ButtonStyle,
  dataSource?: any[];
  dataSources?:Data[];
  optionsStander?: Option[];
  optionMax?: Option[];
  columns: Column[];
}

export interface Data {
  name: string,
  value: any,
  datasource: any[]
}


export interface Option {
  icon: string;
  color: string;
  visibility: boolean,
  type: string
}
export interface ButtonStyle {
  showButton: boolean,
  label: string,
  route: string
}

export interface Column {
  label: string
}

export interface values {
  value: string
}

