export interface Activity {
  name?: string;
  func?: string;
  description?: string;
  itemtype_id?: number;
  parameters?: ParamActivity[];
  dictionaries?: Dictionary[];
  status?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface ParamActivity {
  name?: string;
  value?: string;
  type?: string;
  list?: string;
  label?: string;
}

export interface Dictionary {
  data?: any;
}
