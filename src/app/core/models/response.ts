import {Required} from "@app/core/models/config/annexe";

export interface Response<T = any> {
  error: boolean;
  data: T;
  code: number;
  msg: string;
  type: string;
  token?: string;
}

export interface ResponseAnnexe {
  error: boolean;
  data: Required;
  code: number;
  msg: string;
  type: string;
  token?: string;
}

