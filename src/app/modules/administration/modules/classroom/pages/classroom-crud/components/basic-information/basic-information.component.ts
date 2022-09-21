import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Response, Classroom} from "@app/core/models";
import {
  CrudModel, styleDropdown, typesIdentification,
  ClassroomSelect
} from "@app/modules/administration/modules/classroom/models/classroom-crud-model/classroom-crud-constans";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StepModel} from "@app/ui/components/step/models/step-vertical-model";
import {DataDrop, DropdownModel} from "ecapture-ng-ui/lib/modules/dropdown/models/dropdown";
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import {encryptText} from "@app/core/utils/crypto/cypher";
import {AppState} from "@app/core/store/app.reducers";
import {Store} from "@ngrx/store";
import {ToastService} from "ecapture-ng-ui";
import {showLoader, showToast} from "@app/modules/administration/modules/classroom/models/model-classroom/constans-classroom";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {Subscription} from "rxjs/internal/Subscription";
import {ConfirmationService, Message} from "primeng/api";
import {ClassroomsService} from "@app/modules/administration/modules/classroom/service/classroom/classroom.service";

@Component({
  selector: 'app-basic-information',
  templateUrl: './basic-information.component.html',
  styleUrls: ['./basic-information.component.scss'],
  providers: [ToastService]
})
export class BasicInformationComponent implements OnInit {
  @Input() Classroom: Classroom;
  @Input() isEdit: boolean;
  @Output() returnClassroom = new EventEmitter<Classroom>();
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
               private ClassroomService: ClassroomsService,
               private confirmationService: ConfirmationService,
  ) {
    this.Classroom = {
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
      Classroomname: ['', [Validators.required, Validators.maxLength(255), Validators.pattern('[a-zA-Z ]{2,255}')]],
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
    if (this.returnExistClassroom()) {
      this.loadClassroom();
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
    if (this.returnExistClassroom()) {
      this.updateClassroom();
    } else {
      this.createClassroom();
    }
  }

  public loadClassroom():void {
    this.formBasicInfo.get('dni')!.setValue(this.Classroom.dni);
    this.formBasicInfo.get('Classroomname')!.setValue(this.Classroom.username);
    this.formBasicInfo.get('names')!.setValue(this.Classroom.names);
    this.formBasicInfo.get('lastnames')!.setValue(this.Classroom.lastnames);
    this.formBasicInfo.get('email')!.setValue(this.Classroom.email);
    this.formBasicInfo.get('sexo')!.setValue(this.Classroom.sexo);
    this.formBasicInfo.get('date_birth')!.setValue(this.Classroom.date_birth);
    this.formBasicInfo.get('date_admission')!.setValue(this.Classroom.date_admission);
  }

  createClassroom(): void {
    if (this.formBasicInfo.valid) {
      const ClassroomPersistence: Classroom = {};
      ClassroomPersistence.id = 0;
      ClassroomPersistence.dni = this.formBasicInfo.get('dni')?.value;
      ClassroomPersistence.username = this.formBasicInfo.get('Classroomname')?.value;
      ClassroomPersistence.names = this.formBasicInfo.get('names')?.value;
      ClassroomPersistence.lastnames = this.formBasicInfo.get('lastnames')?.value;
      ClassroomPersistence.email = this.formBasicInfo.get('email')?.value;
      ClassroomPersistence.sexo = String(this.formBasicInfo.get('sexo')?.value);
      ClassroomPersistence.date_birth = new Date(String(this.formBasicInfo.get('date_birth')?.value)).toISOString();
      ClassroomPersistence.date_admission = new Date(String(this.formBasicInfo.get('date_admission')?.value)).toISOString();
      //this.Classroom = ClassroomPersistence;
      //this.returnClassroom.emit(this.Classroom)
      this._subscription.add(
        this.ClassroomService.createClassroom(ClassroomPersistence).subscribe(
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

  private getClassroomByID(ClassroomId: string): void {
    this.ClassroomService.getClassroomByID(ClassroomId).subscribe((resp) => {
      if (resp.error) {
        this.addToast({
          type: 'error',
          message: resp.msg,
          life: 5000,
        });
        // this.notifyClassroom('error', '', resp.msg, 5000);
      } else {
        this.Classroom = resp.data;
        // this.findClassroomSecurityEntity();
      }
    });
  }

  public returnError(nameControl: string) {
    if ((!this.formBasicInfo.get(nameControl)?.hasError('required')|| this.formBasicInfo.get(nameControl)?.touched) && (this.formBasicInfo.get(nameControl)?.value == '')) {
      return true;
    }
    return false;
  }

  private updateClassroom(): void {
    if (this.formBasicInfo.valid) {
      const ClassroomPersistence: Classroom = {};
      ClassroomPersistence.matricula = this.Classroom.matricula;
      ClassroomPersistence.dni = this.formBasicInfo.get('dni')?.value;
      ClassroomPersistence.username = this.formBasicInfo.get('Classroomname')?.value;
      ClassroomPersistence.names = this.formBasicInfo.get('names')?.value;
      ClassroomPersistence.lastnames = this.formBasicInfo.get('lastnames')?.value;
      ClassroomPersistence.email = this.formBasicInfo.get('email')?.value;
      ClassroomPersistence.sexo = String(this.formBasicInfo.get('sexo')?.value);
      ClassroomPersistence.date_birth = new Date(String(this.formBasicInfo.get('date_birth')?.value)).toISOString();
      ClassroomPersistence.date_admission = new Date(String(this.formBasicInfo.get('date_admission')?.value)).toISOString();
      this.ClassroomService.updateClassroom(ClassroomPersistence).subscribe((resp: any) => {
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
        message: 'Dato(s) inválido(s)',
        life: 5000,
      });
      this.isBlockPage = false;
    }
  }

  public returnExistClassroom(): boolean {
    if (Object.keys(this.Classroom).length) {
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
  get Classroomname() {
    return this.formBasicInfo.get('Classroomname');
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
