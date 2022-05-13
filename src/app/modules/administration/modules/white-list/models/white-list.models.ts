export interface ResponseGetWhiteList {
  error:boolean;
  data: WhiteList[];
  code: number;
  type: string;
  msg: string;
}

export interface WhiteList {
  id: number;
  name: string;
  ip: string;
  description: string;
  created_at: string;
  updated_at: string;
}
export interface ResponseCreateWhiteList {
  error:boolean;
  data: WhiteList;
  code: number;
  type: string;
  msg: string;
}

export interface ResponseDeleteWhiteList {
  error:boolean;
  data: WhiteList;
  code: number;
  type: string;
  msg: string;
}
