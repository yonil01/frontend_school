export interface ResponseGetParameters {
  error:boolean;
  data:Parameters[];
  code: number;
  type:string;
  msg:string
}
export interface Parameters {
  id?:number;
  name:string;
  value:string;
  type:string;
  description:string;
  client_id:number;
  is_cipher:boolean;
  created_at?:string;
  updated_at?:string;
}

export interface ResponseCreateParameter {
  error:boolean;
  data:Parameters;
  code: number;
  type:string;
  msg:string
}

export interface ResponseDeleteParameter {
  error:boolean;
  data: Parameters;
  code: number;
  type:string;
  msg:string
}
