export interface ItemSelectList {
  title?: string,
  subTitle?: string,
  columns?: Column[],
  dataSource?: any[],
  options?: Option[],
}

export interface Column {
  label: string,
}

export interface Option {
  icon: string;
  color: string;
  visibility: boolean,
  type: string
}
