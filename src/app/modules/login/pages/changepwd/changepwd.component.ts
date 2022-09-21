import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {EnvServiceProvider} from '@app/core/services/env/env.service.provider';
import {AuthenticationService} from '@app/core/services/authentication/authentication.service';
import {EnvService} from '@app/core/services/env/env.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-changepwd',
  templateUrl: './changepwd.component.html',
  styleUrls: ['./changepwd.component.scss'],
  providers: [EnvService],
})
export class ChangepwdComponent implements OnInit {
  iconTitle1: string = '';
  iconTitle2: string = '';
  iconTitle3: string = '';
  logoBarHead: string = '';
  foto = 'assets/img/icontarget.jpg';
  titulo1 = '';
  titulo2 = '';
  titulo3 = '';
  autogestionParrafo1 = '';
  autogestionParrafo2 = '';
  autogestionParrafo3 = '';
  // @ts-ignore
  recoverFrm: FormGroup;
  blockSpace: RegExp = /[^\s]/;
  user: string = '';
  userName: string = '';
  validate = false;
  year: number;
  changePasswordSuccess = false;

  constructor(
    private formBulder: FormBuilder,
    private authenticationService: AuthenticationService,
    private _route: Router,
  ) {
    const date = new Date();
    this.year = date.getFullYear();
    this.getTitulo();
    this.getParrafos();
    this.getIcons();
  }

  ngOnInit(): void {
    this.recoverForm();
  }

  private recoverForm(): void {
    this.recoverFrm = this.formBulder.group(
      {
        password: ['', Validators.required],
        password_confirm: ['', [Validators.required, this.confirmEmailValidator]],
      },
      {
        validators: this.confirmEmailValidator('password', 'password_confirm'),
      },
    );
  }

  get password() {
    return this.recoverFrm.get('password');
  }

  get password_confirm() {
    return this.recoverFrm.get('password_confirm');
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

  changepwd() {
    if (this.recoverFrm.invalid) {
      Object.values(this.recoverFrm.controls).forEach((control) => {
        control.markAsTouched();
      });
    }
    const changePasswordObj = {
      id: 'b4b61600-9430-40d7-b279-947a4d4817fb',
      ...this.recoverFrm.value,
    };
    this.authenticationService.changePassword(changePasswordObj).subscribe(
      (res: any) => {
        if (res.error) {
          this.notifyUser('error', '', res.msg, 5000);
        } else {
          if (res.code === 29) {
            this.changePasswordSuccess = true;
            this.notifyUser('success', '', res.msg, 5000);
          } else {
            this.notifyUser('info', '', res.msg, 5000);
          }

          // this._route.navigateByUrl('');
        }
      });
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
    this.changePasswordSuccess = false;
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
