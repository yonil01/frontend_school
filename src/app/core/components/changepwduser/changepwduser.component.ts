import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {UserService} from '@app/core/services/graphql/user/user.service';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Response} from '@app/core/models';
import {JwtHelperService} from '@auth0/angular-jwt';
import {encryptText} from '@app/core/utils/crypto/cypher';
import {Subject} from 'rxjs/internal/Subject';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-changepwduser',
  templateUrl: './changepwduser.component.html',
  styleUrls: ['./changepwduser.component.scss'],
  providers: [],
})
export class ChangepwduserComponent implements OnInit {
  @Output() closeFrmpwd = new EventEmitter<boolean>();
  // @ts-ignore
  pwdUserFrm: FormGroup;
  user: string = '';

  public invalidPassword: boolean = false;
  public messageInvalidPassword: string = '';
  public passwordValidatorsValue = new Subject<string>();
  public typeStatusPasswordOld: boolean = false;
  public typeStatusPassword: boolean = false;
  public typeStatusPasswordConf: boolean = false;

  constructor(
    private usersService: UserService,
    private formBulder: FormBuilder,
  ) {
    this.changeForms();
    this.getUser();
    this.passwordValidatorsValue.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe(
      (value) => {
        this.validatePassword(value);
      },
      (error) => {
        console.error(error);
      },
    );
  }

  ngOnInit(): void {
  }

  private changeForms(): void {
    this.pwdUserFrm = this.formBulder.group(
      {
        passwordOld: ['', Validators.required],
        password: ['', Validators.required],
        password_history: ['', [Validators.required, this.confirmEmailValidator]],
      },
      {
        validators: this.confirmEmailValidator('password', 'password_history'),
      },
    );
  }

  parseJwt() {
    const helper = new JwtHelperService();
    const tokenEncryp = sessionStorage.getItem('Token');
    let decodedToken: any;
    if (tokenEncryp) {
      decodedToken = helper.decodeToken(tokenEncryp);
    }
    return decodedToken.user.id;
  }

  getUser() {
    this.user = this.parseJwt();
  }

  changepwd() {
    if (this.pwdUserFrm.valid) {
      const pass: string = encryptText(this.pwdUserFrm.get('password')?.value, '');
      const passConfirm: string = encryptText(this.pwdUserFrm.get('password_history')?.value, '');
      const passOld: string = encryptText(this.pwdUserFrm.get('passwordOld')?.value, '');
      this.usersService.changePassUser(this.user, pass, passConfirm, passOld).subscribe((response: Response) => {
        this.notifyUser(response.type, response.msg, '', 5000);
        if (!response.error) {
          this.pwdUserFrm.reset();
        }
      });
      this.closeFrmpwd.emit(false);
    } else {
      this.notifyUser(
        'error',
        'Error al cambiar la Contraseña',
        'Valide que la información insertada sea correcta',
        5000,
      );
    }
  }

  cancel() {
    // this.userComponent.displayPwd = false;
    this.pwdUserFrm.reset();
    this.closeFrmpwd.emit(false);
  }

  confirmEmailValidator(password: string, password_history: string) {
    return (formGroup: FormGroup) => {
      const pass = formGroup.controls[password];
      const verifypass = formGroup.controls[password_history];

      if (pass.value === verifypass.value) {
        pass.setErrors(null);
      } else {
        verifypass.setErrors({confirmEmailValidator: true});
      }
    };
  }

  notifyUser(severity: string, summary: string, detail: string, life: number): void {
    /*this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
      life: life,
    });*/
  }

  get password() {
    return this.pwdUserFrm.get('password');
  }

  get password_history() {
    return this.pwdUserFrm.get('password_history');
  }

  get passwordOld() {
    return this.pwdUserFrm.get('passwordOld');
  }

  private validatePassword(value: any): void {
    this.validatedUserPassword();
  }

  private validatedUserPassword() {
    const userToken = this.usersService.getTokenUser();
    const roles = userToken.user.roles[0];
    const passwordValidate = {
      password: encryptText(this.pwdUserFrm.value.password.toString(), ''),
      roles: [roles],
    };
    this.usersService.validateUserPassword(passwordValidate).subscribe((res: Response) => {
      if (res.error) {
        this.invalidPassword = true;
        this.messageInvalidPassword = res.msg;
      } else {
        this.invalidPassword = false;
      }
    });
  }
}
