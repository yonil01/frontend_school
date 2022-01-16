import {Injectable} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Store} from '@ngrx/store';
import {AppState} from "@app/core/store/app.reducers";
import {Module} from "@app/core/models";

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  modules!: Module[];

  constructor(private store: Store<AppState>) {
  }

  getModules(): [] {
    const item = sessionStorage.getItem('Modules');
    return item ? JSON.parse(item) : null;
  }

  getRoles() {
    return this.decodeToken().user.roles;
    // return ['root', 'pruebas'];
  }

  getSessionID(): string {
    return this.decodeToken().user.session_id;
  }

  getClientID(): number {
    return this.decodeToken().user.client_id;
  }

  getColors(): any {
    return this.decodeToken().user.colors;
  }

  getUserId(): string {
    return this.decodeToken().user.id;
  }

  getUserName(): string {
    return this.decodeToken().user.name + ' ' + this.decodeToken().user.lastname;
  }

  getSessionExp(): number {
    return this.decodeToken().exp;
  }

  removeSession(): void {
    sessionStorage.clear();
  }

  getToken(): string | null {
    return sessionStorage.getItem('Token');
  }

  getLookAndFeelConfig(): string | null {
    return sessionStorage.getItem('look-and-feel-config');
  }

  private decodeToken() {
    const token = sessionStorage.getItem('Token');
    return token ? helper.decodeToken(token) : null;
  }
}
