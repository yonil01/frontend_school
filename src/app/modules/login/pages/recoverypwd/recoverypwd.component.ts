import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {EnvServiceProvider} from '@app/core/services/env/env.service.provider';
import {EnvService} from '@app/core/services/env/env.service';
import {AuthenticationService} from '@app/core/services/authentication/authentication.service';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {LogoutService} from '@app/core/services/graphql/auth/logout/logout.service';
import {AppState} from '@app/core/store/app.reducers';
import {Store} from '@ngrx/store';
import {Router} from '@angular/router';

@Component({
  selector: 'app-recoverypwd',
  templateUrl: './recoverypwd.component.html',
  styleUrls: ['./recoverypwd.component.scss'],
  providers: [AuthenticationService, EnvService, LogoutService],
})
export class RecoverypwdComponent implements OnInit {
  iconTitle1: string = '';
  iconTitle2: string = '';
  iconTitle3: string = '';
  logoBarHead: string = '';
  year: number;
  // @ts-ignore
  recoverFrm: FormGroup;
  blockSpace: RegExp = /[^\s]/;
  user: string = '';
  userName: string = '';
  validate = false;
  style_h1 = '';
  titulo1 = '';
  titulo2 = '';
  titulo3 = '';
  autogestionParrafo1 = '';
  autogestionParrafo2 = '';
  autogestionParrafo3 = '';
  recoverypwdSuccess = false;

  constructor(
    private formBulder: FormBuilder,
    private localStorageService: LocalStorageService,
    private _localStorageService: LocalStorageService,
    private _loguotService: LogoutService,
    // private usersService: UserService,
    private authenticationService: AuthenticationService,
    private store: Store<AppState>,
    private _route: Router,
  ) {
    const date = new Date();
    this.year = date.getFullYear();
  }

  ngOnInit(): void {
    this.recoverForm();
    this.style();
    this.getTitulo();
    this.getParrafos();
    this.getIcons();
  }

  private recoverForm(): void {
    this.recoverFrm = this.formBulder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(/^[a-z]+[a-z0-9._-]+@[a-z-]+\.[a-z.]{2,5}$/)]],
    });
  }

  get username() {
    return this.recoverFrm.get('username');
  }

  get email() {
    return this.recoverFrm.get('email');
  }

  recovery() {
    if (this.recoverFrm.invalid) {
      Object.values(this.recoverFrm.controls).forEach((control) => {
        control.markAsTouched();
      });
    } else {
      this.authenticationService.forgotPassword(this.recoverFrm.value).subscribe(
        (res: any) => {
          if (res.error && res.code !== 29) {
            this.notifyUser('error', '', res.msg, 5000);
          } else {
            if (res.code === 29) {
              this.notifyUser(
                'info',
                '',
                'Se ha enviado un correo al email: ' +
                this.recoverFrm.value.email +
                ' con un enlace para la recuperacion de la contraseña',
                5000,
              );
              this.recoverypwdSuccess = true;
            } else {
              this.notifyUser('info', '', res.msg, 5000);
            }
          }
        });
    }
  }

  private style() {
    this.style_h1 = EnvServiceProvider.useFactory().STYLE_H1;
    // this.style_h1 = EnvServiceProvider.useFactory().GRAPHQL_API ;
  }

  private getTitulo() {
    this.titulo1 = EnvServiceProvider.useFactory().TITULO_1;
    this.titulo2 = EnvServiceProvider.useFactory().TITULO_2;
    this.titulo3 = EnvServiceProvider.useFactory().TITULO_3;
  }

  private getParrafos() {
    this.autogestionParrafo1 = EnvServiceProvider.useFactory().PARRAFO_1;
    this.autogestionParrafo2 = EnvServiceProvider.useFactory().PARRAFO_2;
    this.autogestionParrafo3 = EnvServiceProvider.useFactory().PARRAFO_3;
  }

  private getIcons() {
    this.iconTitle1 = EnvServiceProvider.useFactory().AUTOGESTION_URL_ICON_TITLE1;
    this.iconTitle2 = EnvServiceProvider.useFactory().AUTOGESTION_URL_ICON_TITLE2;
    this.iconTitle3 = EnvServiceProvider.useFactory().AUTOGESTION_URL_ICON_TITLE3;
    this.logoBarHead = EnvServiceProvider.useFactory().AUTOGESTION_URL_LOGO_TOP;
  }

  redirectionLogin(): void {
    this.recoverypwdSuccess = false;
    this._route.navigateByUrl('');
  }

  notifyUser(severity: string, summary: string, detail: string, life: number): void {
    /*this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
      life: life,
    });*/
  }
}

