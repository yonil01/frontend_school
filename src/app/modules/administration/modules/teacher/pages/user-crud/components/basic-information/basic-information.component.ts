import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Response, User} from "@app/core/models";
import {
  CrudModel, styleDropdown, typesIdentification,
  Teacherelect
} from "@app/modules/administration/modules/teacher/models/teacher-crud-model/teacher-crud-constans";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StepModel} from "@app/ui/components/step/models/step-vertical-model";
import {DataDrop, DropdownModel} from "ecapture-ng-ui/lib/modules/dropdown/models/dropdown";
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import {encryptText} from "@app/core/utils/crypto/cypher";
import {AppState} from "@app/core/store/app.reducers";
import {Store} from "@ngrx/store";
import {ToastService} from "ecapture-ng-ui";
import {showLoader, showToast} from "@app/modules/administration/modules/teacher/models/model-teacher/constans-teacher";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {Subscription} from "rxjs/internal/Subscription";
import {ConfirmationService, Message} from "primeng/api";
import {TeacherService} from "@app/modules/administration/modules/teacher/service/user/users.service";

@Component({
  selector: 'app-basic-information',
  templateUrl: './basic-information.component.html',
  styleUrls: ['./basic-information.component.scss'],
  providers: [ToastService]
})
export class BasicInformationComponent implements OnInit {
  @Input() user: User;
  @Input() isEdit: boolean;
  @Output() returnUser = new EventEmitter<User>();
  @Output() showToast = new EventEmitter<any>();
  public formBasicInfo: FormGroup;
  public styleStep: StepModel = CrudModel;
  public styleDropdown: DropdownModel = styleDropdown;
  public dataDropIdentification: DataDrop[] = typesIdentification;
  public secretKey: string;
  public disabledNext: boolean;
  public showLoader: any = showLoader;
  public isBlockPage: boolean = false;
  public typeExecution: number;
  public showPassword: boolean = false;
  public showPasswordConfirm: boolean = false;
  msgs: Message[] = []
  private _subscription: Subscription = new Subscription();

  constructor( private _formBuilder: FormBuilder,
               private store: Store<AppState>,
               private Teacherervice: TeacherService,
               private confirmationService: ConfirmationService,
  ) {
    this.user = {
      id: 0,
      dni: '',
      matricula: 0,
      username: '',
      names: '',
      lastnames: '',
      sexo: '',
      status: 0,
      date_admission: '',
      date_birth: '',
      email: '',
      is_delete: 0,
      password: '',
      created_at: '',
      updated_at: '',
    }

    this.isEdit = false;
    this.typeExecution = 0;

    this.formBasicInfo = this._formBuilder.group({
      dni: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      username: ['', [Validators.required, Validators.maxLength(255), Validators.pattern('[a-zA-Z ]{2,255}')]],
      names: ['', [Validators.required, Validators.maxLength(255), Validators.pattern('[a-zA-Z ]{2,255}')]],
        lastnames: ['', [Validators.required, Validators.maxLength(255), Validators.pattern('[a-zA-Z ]{2,255}')]],
      email: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/),
        Validators.email, Validators.minLength(5), Validators.maxLength(255)],
      ],
      sexo: ['', [Validators.required]],
      date_birth: ['', Validators.required],
      date_admission: ['', Validators.required],
    },
      {
       // validator: [this.confirmPasswordValidator],
      });
    this.secretKey = '';
    this.disabledNext =  false;
  }

  ngOnInit(): void {
    if (this.returnExistUser()) {
      this.loadUser();
    } else {
      this.disabledNext = true;
    }
    this.store.select('env').subscribe(
      (res) => {
        this.secretKey = res.env;
      },
    );
  }

  confirmPasswordValidator = (form: FormGroup) => {
    const password = form.get('password');
    const password_confirm = form.get('password_confirm');
    return password?.value === password_confirm?.value ? null : {notEqualPassword: true};
  };


  public nextStep() {
    if (this.formBasicInfo.valid) {
      this.saveForm();
    }
  }

  saveForm(): void {
    //this.showLoading(true);
    this.isBlockPage = true;
    if (this.returnExistUser()) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  public loadUser():void {
    this.formBasicInfo.get('dni')!.setValue(this.user.dni);
    this.formBasicInfo.get('username')!.setValue(this.user.username);
    this.formBasicInfo.get('names')!.setValue(this.user.names);
    this.formBasicInfo.get('lastnames')!.setValue(this.user.lastnames);
    this.formBasicInfo.get('email')!.setValue(this.user.email);
    this.formBasicInfo.get('sexo')!.setValue(this.user.sexo);
    this.formBasicInfo.get('date_birth')!.setValue(this.user.date_birth);
    this.formBasicInfo.get('date_admission')!.setValue(this.user.date_admission);
  }

  createUser(): void {
    if (this.formBasicInfo.valid) {
      const userPersistence: User = {};
      userPersistence.id = 0;
      userPersistence.dni = this.formBasicInfo.get('dni')?.value;
      userPersistence.username = this.formBasicInfo.get('username')?.value;
      userPersistence.names = this.formBasicInfo.get('names')?.value;
      userPersistence.lastnames = this.formBasicInfo.get('lastnames')?.value;
      userPersistence.email = this.formBasicInfo.get('email')?.value;
      userPersistence.sexo = String(this.formBasicInfo.get('sexo')?.value);
      userPersistence.date_birth = new Date(String(this.formBasicInfo.get('date_birth')?.value)).toISOString();
      userPersistence.date_admission = new Date(String(this.formBasicInfo.get('date_admission')?.value)).toISOString();
      //this.subject = userPersistence;
      //this.returnUser.emit(this.subject)
      this._subscription.add(
        this.Teacherervice.createUser(userPersistence).subscribe(
          (resp: any) => {
            debugger
          if (resp.error) {
            this.isBlockPage = false;
            this.addToast({
              type: 'error',
              message: resp.msg,
              life: 5000,
            });
          } else {

            this.addToast({
              type: 'success',
              message: resp.msg,
              life: 5000,
            });
            //this.showLoading(false);
            this.isBlockPage = false;
            window.location.reload();
          }
        })
      );

    } else {
      this.addToast({
        type: 'info',
        message: 'Completa todos los campos',
        life: 5000,
      });
      this.isBlockPage = false;
      //this.showLoader(false);
    }
  }

  private getUserByID(userId: string): void {
    this.Teacherervice.getUserByID(userId).subscribe((resp) => {
      if (resp.error) {
        this.addToast({
          type: 'error',
          message: resp.msg,
          life: 5000,
        });
        // this.notifyUser('error', '', resp.msg, 5000);
      } else {
        this.user = resp.data;
        // this.findTeacherecurityEntity();
      }
    });
  }

  public returnError(nameControl: string) {
    if ((!this.formBasicInfo.get(nameControl)?.hasError('required')|| this.formBasicInfo.get(nameControl)?.touched) && (this.formBasicInfo.get(nameControl)?.value == '')) {
      return true;
    }
    return false;
  }

  private updateUser(): void {
    if (this.formBasicInfo.valid) {
      const userPersistence: User = {};
      userPersistence.matricula = this.user.matricula;
      userPersistence.dni = this.formBasicInfo.get('dni')?.value;
      userPersistence.username = this.formBasicInfo.get('username')?.value;
      userPersistence.names = this.formBasicInfo.get('names')?.value;
      userPersistence.lastnames = this.formBasicInfo.get('lastnames')?.value;
      userPersistence.email = this.formBasicInfo.get('email')?.value;
      userPersistence.sexo = String(this.formBasicInfo.get('sexo')?.value);
      userPersistence.date_birth = new Date(String(this.formBasicInfo.get('date_birth')?.value)).toISOString();
      userPersistence.date_admission = new Date(String(this.formBasicInfo.get('date_admission')?.value)).toISOString();
      this.Teacherervice.updateUser(userPersistence).subscribe((resp: any) => {
        if (!resp.error) {
          this.addToast({
            type: 'success',
            message: resp.msg,
            life: 5000,
          });
          //this.showLoading(false);
          this.isBlockPage = false;
            window.location.reload();
        } else {
          this.addToast({
            type: 'error',
            message: resp.msg,
            life: 5000,
          });
          //this.showLoading(false);
          this.isBlockPage = false;
        }
      });
    }else{
      this.addToast({
        type: 'error',
        message: 'Dato(s) inv??lido(s)',
        life: 5000,
      });
      this.isBlockPage = false;
    }
  }

  public returnExistUser(): boolean {
    if (Object.keys(this.user).length) {
      return true;
    } else {
      return false;
    }
  }

  public showLoading(value: boolean) {
    this.showLoader.forEach((item: any) => {
      item.value = value;
    })
  }

  public addToast(data: any): void {
    this.showToast.emit({type: data.type, message: data.message, life: data.life});
  }

  // getValue
  get username() {
    return this.formBasicInfo.get('username');
  }

  public changeStatusStep(index: number):void {
    this.styleStep.dataSourceStep.forEach((item: any, i:number) => {
      if (index === i) {
        item.status = 'Completed'
      }
      if ((index + 1) === i) {
        item.focus = true;
        item.block = false;
      } else {
        item.focus = false;
      }
    });
  }

}
