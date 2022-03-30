import {DocTypes} from "@app/core/models";

export interface TableModel {
  type?: number;
  isSearch?: boolean;
  buttonTittle?: buttonTittle,
  dataSource?: any[];
  dataSources?:data[];
  options?: option[];
  optionMax?: option[];
  columns: Column[];
}

export interface data {
  title: string,
  datasource: DocTypes[]
}

export interface unitTable {
  value: string;
}

export interface option {
  icon: string;
  color: string;
  visibility: boolean,
  type: string
}
export interface buttonTittle {
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

