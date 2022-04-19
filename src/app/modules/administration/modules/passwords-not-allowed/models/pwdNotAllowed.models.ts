export interface ResponseGetPwdNotAllowed {
  error: boolean;
  data: PwdNotAllowed[];
  code: number;
  type: string;
  msg: string;
}

export interface PwdNotAllowed {
  id: number;
  password: string;
}
export interface ResponseCreateBlackListPwd {
  error: boolean;
  data: PwdNotAllowed;
  code: number;
  type: string;
  msg: string;
}

export interface ResponseDeleteBlackListPwd {
  error: boolean;
  data: PwdNotAllowed;
  code: number;
  type: string;
  msg: string;
}
