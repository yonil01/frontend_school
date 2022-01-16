import {Component, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [EnvService]
})
export class LoginComponent implements OnInit {

  private subscription: Subscription = new Subscription();

  public formLogin!: FormGroup;

  public isErrorLogin = false;
  public isLoading = false;
  public siteKey;
  public secretKey: string = '';

  public isBlock = false;

  public toastStyle: ToastStyleModel = toastDataStyle;

  constructor(
    private _fb: FormBuilder,
    private _route: Router,
    private _authenticationService: AuthenticationService,
    private store: Store<AppState>,
    private messageService: ToastService
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
  }

  private initForm() {
    this.formLogin = this._fb.group({
      user: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      recaptcha: ['']
    })
  }

  public login() { //loginError
    this.isErrorLogin = false;
    this.isLoading = true;
    this.subscription.add(
      this._authenticationService.login(this.formLogin.value, this.secretKey).subscribe(
        (resp: any) => {
          if (resp.data) {
            this._authenticationService.setTokenSessionStorage(resp.data);
            this.store.dispatch(controlLogin({ logged: true }));
          } else {
            this.isErrorLogin = true;
          }
          this.isLogged();
          this.isLoading = false;
        },
        (err) => {
          this.messageService.add({
            type: 'error',
            message: 'Inicio de sesión fallido',
            life: 5000,
          });
          this.isLoading = false;
        }),
    );
  }

  public forgotPass() {

  }

  private getKeysENV() {
    this.siteKey = ''
  }

  public async recovery() {
    await this._route.navigateByUrl('auth/recovery')
  }

  private isLogged() {}

}
