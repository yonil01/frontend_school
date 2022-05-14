import {Injectable} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Store} from '@ngrx/store';
import {AppState} from "@app/core/store/app.reducers";
import {Module, Project} from "@app/core/models";
import {Client} from "@app/core/models/wizard/wizard";
import {decryptText, encryptText} from "@app/core/utils/crypto/cypher";

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  modules!: Module[];
  public secretKey: string = '';
  private key = '204812730425442A472D2F423F452847';

  constructor(private store: Store<AppState>) {
    this.store.select('env').subscribe(
      (res) => {
        this.secretKey = res.env;
      },
    );
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

  public getClient(): string {
    const client = sessionStorage.getItem('client');
    return client ? JSON.parse(client).name : '';
  }

  public getProject(): string {
    const project = sessionStorage.getItem('project');
    return project ? JSON.parse(project).name : ''
  }

  public getLanguage(): string {
    const lang = decryptText(localStorage.getItem('Language') || '', this.key)
    if (lang) {
      const objLanguage = JSON.parse(lang);
      if (this.getUserId() === objLanguage.id) {
        return objLanguage.language;
      }
    }
    return 'es';
  }

  public setLanguage(language: string): void {
    const objLanguage = {
      id: this.getUserId(),
      language: language
    };
    localStorage.setItem('Language', encryptText(JSON.stringify(objLanguage), this.key));
  }

}
