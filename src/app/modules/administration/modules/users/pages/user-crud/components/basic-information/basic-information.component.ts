import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Response, User} from "@app/core/models";
import {
  CrudModel, styleDropdown, typesIdentification,
  userSelect
} from "@app/modules/administration/modules/users/models/user-crud-model/user-crud-constans";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StepModel} from "@app/ui/components/step/models/step-vertical-model";
import {DataDrop, DropdownModel} from "ecapture-ng-ui/lib/modules/dropdown/models/dropdown";
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import {encryptText} from "@app/core/utils/crypto/cypher";
import {AppState} from "@app/core/store/app.reducers";
import {Store} from "@ngrx/store";
import {UsersService} from "@app/modules/administration/modules/users/service/user/users.service";
import {ToastService} from "ecapture-ng-ui";
import {showLoader, showToast} from "@app/modules/administration/modules/users/models/model-user/constans-user";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";

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

  constructor( private _formBuilder: FormBuilder,
               private store: Store<AppState>,
               private userService: UsersService,
  ) {
    this.user = {
      id: '',
      username: '',
      name: '',
      last_name: '',
      email_notifications: '',
      identification_number: '',
      identification_type: '',
      status: 0,
      roles: [
        {
          id: '',
          name: '',
          role_allow: {}
        }
      ],
      security_entities: [],
      created_at: ''
    }

    this.isEdit = false;
    this.typeExecution = 0;

    this.formBasicInfo = this._formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9_]+$')]],
      name: ['', [Validators.required, Validators.maxLength(255), Validators.pattern('[a-zA-Z ]{2,255}')]],
      last_name: ['', [Validators.required, Validators.maxLength(255), Validators.pattern('[a-zA-Z ]{2,255}')]],
      email_notifications: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/),
        Validators.email, Validators.minLength(5), Validators.maxLength(255)],
      ],
      identification_type: ['', Validators.required],
      identification_number: ['', [Validators.required, Validators.maxLength(255)]],
      password: [''],
      password_comfirm: [''],
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
    this.formBasicInfo.get('username')!.setValue(this.user.username);
    this.formBasicInfo.get('name')!.setValue(this.user.name);
    this.formBasicInfo.get('last_name')!.setValue(this.user.last_name);
    this.formBasicInfo.get('email_notifications')!.setValue(this.user.email_notifications);
    this.formBasicInfo.get('identification_number')!.setValue(this.user.identification_number);

    this.formBasicInfo.get('identification_type')!.setValue(this.user.identification_type);
  }

  createUser(): void {
    if (this.formBasicInfo.valid) {
      const userPersistence: User = {};
      userPersistence.id = uuidv4().toLowerCase();
      userPersistence.name = this.formBasicInfo.get('name')?.value;
      userPersistence.username = this.formBasicInfo.get('username')?.value;
      userPersistence.last_name = this.formBasicInfo.get('last_name')?.value;
      userPersistence.email_notifications = this.formBasicInfo.get('email_notifications')?.value;
      userPersistence.identification_type = this.formBasicInfo.get('identification_type')?.value;
      userPersistence.identification_number = this.formBasicInfo.get('identification_number')?.value;
      userPersistence.password = encryptText(this.formBasicInfo.get('password')?.value, this.secretKey);
      userPersistence.password_comfirm = encryptText(this.formBasicInfo.get('password_comfirm')?.value, this.secretKey);
      this.user = userPersistence;
      this.returnUser.emit(this.user)
      this.userService.createUser(userPersistence).subscribe((resp: Response) => {
        debugger
        if (resp.error) {
          //this.showLoading(false);
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
          this.disabledNext = false;
          this.getUserByID(userPersistence.id!);
          //this.showLoading(false);
          this.isBlockPage = false;
          if (this.typeExecution === 1) {
            this.changeStatusStep(0);
          }
        }
      });
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
    this.userService.getUserByID(userId).subscribe((resp) => {
      if (resp.error) {
        this.addToast({
          type: 'error',
          message: resp.msg,
          life: 5000,
        });
        // this.notifyUser('error', '', resp.msg, 5000);
      } else {
        this.user = resp.data;
        // this.findUserSecurityEntity();
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
      userPersistence.id = this.user.id?.toLowerCase();
      userPersistence.username = this.formBasicInfo.get('username')?.value;
      userPersistence.name = this.formBasicInfo.get('name')?.value;
      userPersistence.last_name = this.formBasicInfo.get('last_name')?.value;
      userPersistence.email_notifications = this.formBasicInfo.get('email_notifications')?.value;
      userPersistence.identification_number = this.formBasicInfo.get('identification_number')?.value;
      userPersistence.identification_type = this.formBasicInfo.get('identification_type')?.value;
      userPersistence.password = '';
      userPersistence.password_comfirm = '';
      this.userService.updateUser(userPersistence).subscribe((resp: Response) => {
        if (!resp.error) {
          this.addToast({
            type: 'success',
            message: resp.msg,
            life: 5000,
          });
          //this.showLoading(false);
          this.isBlockPage = false;
          if (this.typeExecution === 1) {
            this.changeStatusStep(0);
          }
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
        message: 'Dato(s) inválido(s)',
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
