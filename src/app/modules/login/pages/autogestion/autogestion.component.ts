import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {AuthenticationService} from '@app/core/services/authentication/authentication.service';
import {User} from '@app/core/models';
import {EnvServiceProvider} from '@app/core/services/env/env.service.provider';
import {EnvService} from '@app/core/services/env/env.service';
import {LogoutService} from '@app/core/services/graphql/auth/logout/logout.service';
import {controlLogin} from '@app/core/store/actions/token.action';
import {AppState} from '@app/core/store/app.reducers';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {UserService} from '@app/core/services/graphql/user/user.service';
import {UsersComponent} from '@app/core/utils/users/users.component';
import {CreateuserComponent} from '@app/core/utils/users/createuser/createuser.component';
import {Subject} from 'rxjs/internal/Subject';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {DropdownModel, ToastService} from "ecapture-ng-ui";
import {Subscription} from "rxjs/internal/Subscription";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/modules/login/data/style/data.style";
import {decryptText} from "@app/core/utils/crypto/cypher";
import {confirmEmailValidator} from "@app/core/custon-validators/user.validators";
import {onlyLetters, onlyNumbers} from "@app/core/utils/validations/validations";

@Component({
  selector: 'app-autogestion',
  templateUrl: './autogestion.component.html',
  styleUrls: ['./autogestion.component.scss'],
  providers: [
    UsersComponent,
    CreateuserComponent,
    AuthenticationService,
    EnvService,
    LogoutService,
  ],
})
export class AutogestionComponent implements OnInit, OnDestroy {
  public invalidName: boolean = false;
  public invalidEmail: boolean = false;
  public invalidPassword: boolean = false;
  public messageInvalidPassword: string = '';
  public createUserFrm: FormGroup;
  public createUserSuccess = false;
  public passwordValidatorsValue = new Subject<string>();
  public usernameValidatorsValue = new Subject<string>();
  public emailValidatorsValue = new Subject<string>();
  public typeIdentificationStyle: DropdownModel;
  private subscription: Subscription = new Subscription();
  public toastStyle: ToastStyleModel = toastDataStyle;
  public isBlock: boolean = false;
  public typeIdentification: any[];

  constructor(
    private userComponent: UsersComponent,
    private formBuilder: FormBuilder,
    public createUserComponent: CreateuserComponent,
    private usersService: UserService,
    private authenticationService: AuthenticationService,
    private localStorageService: LocalStorageService,
    private _localStorageService: LocalStorageService,
    private _loguotService: LogoutService,
    private store: Store<AppState>,
    private _route: Router,
    private messageService: ToastService
  ) {
    this.createUserFrm = this.formBuilder.group(
      {
        username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9_]+$')]],
        email_notifications: ['', [Validators.required, Validators.email]],
        identification_type: ['', Validators.required],
        identification_number: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
        name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(255), Validators.pattern('[a-zA-Z\u00f1\u00d1 ]{4,255}')]],
        last_name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(255), Validators.pattern('[a-zA-Z\u00f1\u00d1 ]{4,255}')]],
        password: ['', Validators.required],
        password_confirm: ['', Validators.required],
      },
      {
        validators: [
          confirmEmailValidator()
        ]
      },
    );
    this.typeIdentification = [
      {label: 'Cédula de ciudadania', value: 'C'},
      {label: 'Cédula de extranjería', value: 'E'},
      {label: 'Pasaporte', value: 'P'},
      {label: 'Acta de nacimiento', value: 'R'},
      {label: 'Carnet diplomático', value: 'D'},
      {label: 'RNC', value: 'A'},
      {label: 'Otros', value: 'O'}
    ];
    this.typeIdentificationStyle = {
      textColor: 'text-black',
      container: {
        background: 'bg-mono-10',
        border: {
          color: 'border-mono-10',
          size: 'border-4',
          round: 'rounded-lg',
          style: 'border-solid',
          hover: 'border-mono-30'
        }
      },
      optionContainer: {
        background: 'bg-mono-10',
        border: {
          color: 'border-mono-30',
          size: 'border-2',
          round: 'rounded',
          style: 'border-solid',
          hover: 'bg-mono-30'
        }
      },
    };
    this.passwordValidatorsValue.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe(
      (value) => {
        this.validatePassword(value);
      },
    );
    this.usernameValidatorsValue.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe(
      (value) => {
        this.validatedUserName(value);
      },
    );
    this.emailValidatorsValue.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe(
      (value) => {
        this.validatedUserEmail(value);
      },
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get username() {
    return this.createUserFrm.get('username');
  }

  get email_notifications() {
    return this.createUserFrm.get('email_notifications');
  }

  get identification_type() {
    return this.createUserFrm.get('identification_type');
  }

  get identification_number() {
    return this.createUserFrm.get('identification_number');
  }

  get name() {
    return this.createUserFrm.get('name');
  }

  get last_name() {
    return this.createUserFrm.get('last_name');
  }

  get password() {
    return this.createUserFrm.get('password');
  }

  get password_confirm() {
    return this.createUserFrm.get('password_confirm');
  }

  public save(): void {
    const newUser: User = this.createUserFrm.value;
    if (this.createUserFrm.invalid || this.invalidName || this.invalidEmail || this.invalidPassword) {
      this.messageService.add(
        {
          type: 'warning',
          message: 'Complete todos los campos correctamente!',
          life: 5000
        });
      Object.values(this.createUserFrm.controls).forEach((control) => {
        control.markAsTouched();
      });
    } else {
      this.isBlock = true;
      this.subscription.add(
        this.authenticationService.createUser(newUser).subscribe(
          (res: any) => {
            if (res.error) {
              this.isBlock = false;
              this.messageService.add(
                {
                  type: 'error',
                  message: res.msg,
                  life: 5000
                });
            } else {
              this.isBlock = false;
              this.createUserSuccess = true;
              this.messageService.add(
                {
                  type: 'success',
                  message: res.msg,
                  life: 5000
                });
            }
          },
          (err: Error) => {
            this.messageService.add(
              {
                type: 'error',
                message: err.message,
                life: 5000
              });
            this.isBlock = false;
          })
      );
    }
  }

  private autoLogin(): Promise<boolean> {
    this.isBlock = true;
    return new Promise((resolve) => {
      const userLogin = decryptText(EnvServiceProvider.useFactory().AUTOLOGIN_USER);
      const passLogin = decryptText(EnvServiceProvider.useFactory().AUTOLOGIN_PASSWORD);
      if (userLogin !== '' && passLogin !== '') {
        this.authenticationService
          .autoLogin(userLogin, passLogin)
          .toPromise()
          .then((res: any) => {
            if (res.error) {
              this.messageService.add(
                {
                  type: 'error',
                  message: res.msg,
                  life: 5000
                });
              this.isBlock = false;
              return resolve(false);
            } else {
              this.isBlock = false;
              this.authenticationService.setTokenSessionStorage(res.data);
              return resolve(true);
            }
          });
      } else {
        this.messageService.add(
          {
            type: 'error',
            message: 'Error, el usuario o contraseña no son los correctos.',
            life: 5000
          });
        this.isBlock = false;
        return resolve(false);
      }
    });
  }

  private logout(): void {
    this._loguotService.logout();
    this._localStorageService.removeSession();
    this.store.dispatch(controlLogin({logged: false}));
    this._route.navigateByUrl('');
  }

  public validatedUserName(value: string): void {
    const username = value ? value : this.createUserFrm.get('username')?.value;
    this.subscription.add(
      this.authenticationService.validateUserName(username).subscribe(
        (res: any) => {
          this.invalidName = res.data;
        },
        (err: Error) => {
          this.messageService.add(
            {
              type: 'error',
              message: err.message,
              life: 5000
            });
        })
    );
  }

  public validatedUserEmail(value: string): void {
    const email = value ? value : this.createUserFrm.value.email_notifications;
    this.subscription.add(
      this.authenticationService.validateEmail(email).subscribe(
        (res) => {
          this.invalidEmail = res.data;
        },
        (err: Error) => {
          this.invalidEmail = true;
          this.messageService.add(
            {
              type: 'error',
              message: err.message,
              life: 5000
            });
        })
    );
  }

  public redirectionLogin(): void {
    this.createUserSuccess = false;
    this._route.navigateByUrl('');
  }

  private validatePassword(value: string): void {
    this.validatedUserPassword(value);
  }

  public validatedUserPassword(value: string): void {
    const passwordValidate = {
      password: value ? value : this.createUserFrm.value.password,
    };
    if (passwordValidate.password !== '') {
      this.subscription.add(
        this.authenticationService.validateUserPassword(passwordValidate).subscribe(
          (res: any) => {
            if (res.error) {
              this.invalidPassword = true;
              this.messageInvalidPassword = res.msg;
            } else {
              this.invalidPassword = false;
            }
          },
          (err: Error) => {
            this.messageService.add(
              {
                type: 'error',
                message: err.message,
                life: 5000
              });
          })
      );
    }
  }

  public onlyNumber = (value: any) => onlyNumbers(value);

  public onlyLetters = (value: KeyboardEvent) => onlyLetters(value);

}
