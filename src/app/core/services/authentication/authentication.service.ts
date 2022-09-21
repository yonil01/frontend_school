import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EnvServiceProvider} from "@app/core/services/env/env.service.provider";
import {encryptText} from "@app/core/utils/crypto/cypher";
import {map} from "rxjs/operators";
import {Store} from '@ngrx/store';
import {AppState} from "@app/core/store/app.reducers";
import {controlTimeout} from "@app/core/store/actions/token.action";
import {LocalStorageService} from "@app/core/services/local-storage/local-storage.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private _httpClient: HttpClient,
              private store: Store<AppState>,
              private localStorageService: LocalStorageService) {
  }

  public login(value: any, secretKey: string) {
    const url = EnvServiceProvider.useFactory().REST_API + '/api/v4/auth';
    const data = {
      id: encryptText(value.user, secretKey),
      password: encryptText(value.password, secretKey),
      client_id: 9926,
      host_name: 'hostname',
    };

    return this._httpClient.post(url, data).pipe(map((res) => res));
  }

  /*validateUserName(username: string) {
    let url = EnvServiceProvider.useFactory().REST_API + '/api/v1/subject/subject-exist';
    url = url + '?' + 'subject=' + username;
    return this._httpClient.get(url).pipe(map((res) => res));
  }

  validateUserEmail(useremail: string) {
    let url = EnvServiceProvider.useFactory().REST_API + '/api/v1/subject/email-exist';
    url = url + '?' + 'email-exist=' + useremail;
    return this._httpClient.get(url).pipe(map((res) => res));
  }

  validateUserPassword(password: any) {
    const url = EnvServiceProvider.useFactory().REST_API + '/api/v1/auth/password-policy';
    return this._httpClient.post(url, password).pipe(map((res) => res));
  }

  forgotPassword(forgotPassword: any) {
    const url = EnvServiceProvider.useFactory().REST_API + '/api/v1/auth/forgot-password';
    return this._httpClient.post(url, forgotPassword).pipe(map((res) => res));
  }

  changePassword(passwords: any) {
    const url = EnvServiceProvider.useFactory().REST_API + '/api/v1/auth/change-password';
    return this._httpClient.post(url, passwords).pipe(map((res) => res));
  }

  autoLogin(id: any, password: any) {
    const url = EnvServiceProvider.useFactory().GRAPHQL_API + '/api/v3/auth';
    const data = {
      id: id,
      password: password,
      client_id: 2,
      host_name: 'hostname',
    };

    return this._httpClient.post(url, data).pipe(map((res) => res));
  }*/

  setTokenSessionStorage(token: any) {
    // const str = JSON.stringify(token);
    sessionStorage.setItem('Token', token.access_token);
    const timeout = this.localStorageService.getSessionExp();
    this.store.dispatch(controlTimeout({timeout: timeout}));
  }

  public getTokenSessionStorage(param: string = '') {
    if (sessionStorage.getItem('Token')) {
      const tokenEncrypt = sessionStorage.getItem('Token') || '';
      const token = JSON.parse(tokenEncrypt);
      if (param === '') {
        return token;
      }
    }
    return '';
  }

  public isLogged(): boolean {
    return !!sessionStorage.getItem('Token');
  }

}
