export interface Response<T = any> {
  error: boolean;
  data: T;
  code: number;
  msg: string;
  type: string;
  token?: string;
}
