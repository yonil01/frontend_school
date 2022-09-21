import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {encryptText} from "@app/core/utils/crypto/cypher";
import {Response, Classroom} from "@app/core/models";
import {showLoader, showToast} from "@app/modules/administration/modules/classroom/models/model-classroom/constans-classroom";
import {ClassroomsService} from "@app/modules/administration/modules/classroom/service/classroom/classroom.service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  public formPassword: FormGroup;
  @Output() showToast = new EventEmitter<any>();
  @Input() Classroom: Classroom;
  public secretKey: string;
  public showLoader: any = showLoader;
  public showPassword: boolean = false;
  public showPasswordConfirm: boolean = false;
  constructor(private _formBuilder: FormBuilder, private ClassroomService: ClassroomsService,) {

    this.formPassword = this._formBuilder.group({
      password: [''],
      password_confirm: [''],
    },
      {
        validators: [this.confirmPasswordValidator],
      });
    this.secretKey = '204812730425442A472D2F423F452847';
    this.Classroom = {};
  }

  ngOnInit(): void {
  }

  public saveForm():void {
    if (this.formPassword.valid) {
      if (this.comparePassword()) {
        this.showLoading(true);
        const password: string = encryptText(this.formPassword.get('password')?.value, this.secretKey);
        const passpasswordConfirm: string = encryptText(this.formPassword.get('password_confirm')?.value, this.secretKey);
        // const id: string = this.idGlobal;
        this.ClassroomService.updatePasswordByAdministrator(
          this.Classroom?.dni!.toLowerCase(),
          password,
          passpasswordConfirm,
        ).subscribe(
          (response: Response) => {
            if (response.error) {
              this.showLoading(false);
              this.addToast({
                type: 'error',
                message: response.msg,
                life: 5000,
              });
            } else {
              this.showLoading(false);
              this.addToast({
                type: 'success',
                message: response.msg,
                life: 5000,
              });
              this.formPassword.reset();
            }
          });
      } else {
        this.addToast({
          type: 'error',
          message: 'Verifica la contraseña!',
          life: 5000,
        });
      }
    } else {
      this.addToast({
        type: 'error',
        message: 'Llena los campos!',
        life: 5000,
      });
    }
  }

  confirmPasswordValidator = (form: FormGroup) => {
    const password = form.get('password');
    const password_confirm = form.get('password_confirm');
    return password?.value === password_confirm?.value ? null : {notEqualPassword: true};
  };

  public comparePassword(): boolean {
    if (this.formPassword.get('password')?.value === this.formPassword.get('password_confirm')?.value) {
      return true
    } else {
      return false;
    }
  }

  public addToast(data: any): void {
    this.showToast.emit({type: data.type, message: data.message, life: data.life});
  }

  public showLoading(value: boolean) {
    this.showLoader.forEach((item: any) => {
      item.value = value;
    })
  }
}
