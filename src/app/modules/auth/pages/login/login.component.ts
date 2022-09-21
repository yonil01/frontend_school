import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthenticationService} from "@app/core/services/authentication/authentication.service";
import {Store} from '@ngrx/store';
import {Subscription} from "rxjs/internal/Subscription";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {AppState} from "@app/core/store/app.reducers";
import {controlLogin} from "@app/core/store/actions/token.action";
import {ToastService} from "ecapture-ng-ui";
import {EnvService} from "@app/core/services/env/env.service";
import * as models from "@app/core/models";
import {controlModules} from "@app/core/store/actions/modules.action";
import {EnvServiceProvider} from "@app/core/services/env/env.service.provider";
import {ModulesService} from "@app/core/services/graphql/auth/modules/modules.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [EnvService]
})
export class LoginComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  public formLogin!: FormGroup;

  public isErrorLogin = false;
  public isLoading = false;
  public dataRol: any = ['Administración', 'Alumno', 'Profesor']
  public siteKey;
  public url_logo = '';
  public version_ecatch = '';
  public slogan = '';
  public version = '';
  public nameProject = '';

  public secretKey: string = '';

  public toastStyle: ToastStyleModel = toastDataStyle;

  constructor(
    private _fb: FormBuilder,
    private _route: Router,
    private _authenticationService: AuthenticationService,
    private store: Store<AppState>,
    private _messageService: ToastService,
    private _modulesService: ModulesService
  ) {
    this.siteKey = '';
    this.initForm();
    this.isLogged();
    this.store.select('env').subscribe(
      (res) => {
        this.secretKey = res.env;
      }
    );
  }

  ngOnInit(): void {
    this.initForm();
    this.getDataDynamic();
    this.changes();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private initForm() {
    this.formLogin = this._fb.group({
      user: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      recaptcha: ['']
    })
  }

  public login() { //loginError

    if(this.formLogin.valid) {

      this.isErrorLogin = false;
      this.isLoading = true;
      this.subscription.add(
        this._authenticationService.login(this.formLogin.value, this.secretKey).subscribe(
          async (resp: any) => {
            if (resp.error) {
              this.isErrorLogin = true;
              this._messageService.add({
                type: 'error',
                message: 'Usuario o contraseña incorrectos',
                life: 5000,
              });
            } else {
              if (resp.data) {
                this._authenticationService.setTokenSessionStorage(resp.data);
                this.store.dispatch(controlLogin({logged: true}));
              } else {
                this.isErrorLogin = true;
              }
              await this.isLogged();
            }
            this.isLoading = false;
          },
          (err) => {
            this._messageService.add({
              type: 'error',
              message: 'Inicio de sesión fallido',
              life: 5000,
            });
            this.isLoading = false;
          }),
      );
    }else {
      this._messageService.add({
        type: 'warning',
        message: 'Complete los campos correctamente',
        life: 5000,
      });
      this.formLogin.markAllAsTouched();
    }
  }

  private getKeysENV() {
    this.siteKey = ''
  }

  public async recovery() {
    await this._route.navigateByUrl('auth/recovery')
  }

  private async isLogged() {
    if (this._authenticationService.isLogged()) {
      // this._route.navigateByUrl('wizard');
      const modules: models.Module[] = await this.getModules();
      // const modules: Module[] = this._localStorageService.getModules();
      sessionStorage.setItem('Modules', JSON.stringify(modules));
      this.store.dispatch(controlModules({modules: modules}));
      if (modules.length > 0) {
        const dataComponents = modules.map((module: models.Module) => module.components);

        if (dataComponents.some((component: any) => component[0].url_front === '/wizard')) {
          await this._route.navigateByUrl('wizard');
        } else {
          const {components: firstComponent} = modules[0];
          if (firstComponent) await this._route.navigateByUrl(firstComponent[0].url_front || '');
        }
        this.isLoading = false;
      } else {
        this._messageService.add({
          type: 'info',
          message: 'Su rol no tiene módulos asignados, se ha cerrado sesión automaticamente.',
          life: 5000,
        });
        sessionStorage.clear();
      }
      // this._route.navigateByUrl('workflow/inbox');
    }
  }

  public getModules(): Promise<any> {
    return new Promise((res, rej) => {
      this.subscription.add(
        this._modulesService
          .getModulesByRole(['8E5DF79B-7B22-4B2D-A3A2-0986224724E2', '667C1C37-0D72-4ECC-945E-93AB97B4B0CC'], 1)
          .subscribe((resp) => {
            if (resp.error) {
              rej(resp.error);
              return;
            }
            res(resp.data);
          }),
      );
    });
  }

  private changes() {
    this.subscription.add(
      this.formLogin.valueChanges.subscribe(() => {
        this.isErrorLogin = false;
      }),
    );
  }

  /*public async register() {
    await this._route.navigateByUrl('/autogestion');
  }*/

  public async forgotPass() {
    await this._route.navigateByUrl('/recoverypwd');
  }

  private getDataDynamic() {
    this.url_logo = EnvServiceProvider.useFactory().LOGIN_URL_LOGO;
    this.version_ecatch = EnvServiceProvider.useFactory().LOGIN_VERSION;
    this.slogan = EnvServiceProvider.useFactory().LOGIN_SLOGAN;
    this.version = EnvServiceProvider.useFactory().LOGIN_VERSION;
    this.nameProject = EnvServiceProvider.useFactory().LOGIN_PROYECTO;
    this.siteKey = EnvServiceProvider.useFactory().GOOGLE_RECAPTCHA_SITEKEY;
    if (this.siteKey !== '') {
      this.formLogin.controls.recaptcha.setValidators([Validators.required]);
      this.formLogin.controls.recaptcha.updateValueAndValidity();
    }
  }

}
