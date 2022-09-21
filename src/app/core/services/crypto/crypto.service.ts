import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EnvServiceProvider } from '../env/env.service.provider';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {

  private urlGetIDApp: string;

  constructor(
    private _httpClient: HttpClient,
  ) {
    this.urlGetIDApp = EnvServiceProvider.useFactory().REST_API + '/api/v1/cipher/key-app';
  }

  /*public getAppId(): Observable<any> {
    return this._httpClient.get<any>(this.urlGetIDApp).pipe((res) => res);
  }*/
}
