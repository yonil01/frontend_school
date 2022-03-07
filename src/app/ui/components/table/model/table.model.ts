export interface TableModel {
  dataSource?: unitTable[];
  options?: option[];
}

export interface unitTable {
  value: string;
}

export interface option {
  icon: string;
  color: string;
  visibility: boolean
}
