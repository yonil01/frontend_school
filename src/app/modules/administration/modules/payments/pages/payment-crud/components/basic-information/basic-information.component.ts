import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Response, Payment} from "@app/core/models";
import {
  CrudModel, styleDropdown, typesIdentification,
  PaymentSelect
} from "@app/modules/administration/modules/payments/models/payment-crud-model/payment-crud-constans";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StepModel} from "@app/ui/components/step/models/step-vertical-model";
import {DataDrop, DropdownModel} from "ecapture-ng-ui/lib/modules/dropdown/models/dropdown";
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import {encryptText} from "@app/core/utils/crypto/cypher";
import {AppState} from "@app/core/store/app.reducers";
import {Store} from "@ngrx/store";
import {PaymentsService} from "@app/modules/administration/modules/payments/service/payment/payments.service";
import {ToastService} from "ecapture-ng-ui";
import {showLoader, showToast} from "@app/modules/administration/modules/payments/models/model-Payment/constans-Payment";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {Subscription} from "rxjs/internal/Subscription";
import {ConfirmationService, Message} from "primeng/api";

@Component({
  selector: 'app-basic-information',
  templateUrl: './basic-information.component.html',
  styleUrls: ['./basic-information.component.scss'],
  providers: [ToastService]
})
export class BasicInformationComponent implements OnInit {
  @Input() Payment: Payment;
  @Input() isEdit: boolean;
  @Output() returnPayment = new EventEmitter<Payment>();
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
               private PaymentService: PaymentsService,
               private confirmationService: ConfirmationService,
  ) {
    this.Payment = {
      id: 0,
      dni: '',
      matricula: 0,
      Paymentname: '',
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
      Paymentname: ['', [Validators.required, Validators.maxLength(255), Validators.pattern('[a-zA-Z ]{2,255}')]],
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
    if (this.returnExistPayment()) {
      this.loadPayment();
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
    if (this.returnExistPayment()) {
      this.updatePayment();
    } else {
      this.createPayment();
    }
  }

  public loadPayment():void {
    this.formBasicInfo.get('dni')!.setValue(this.Payment.dni);
    this.formBasicInfo.get('Paymentname')!.setValue(this.Payment.Paymentname);
    this.formBasicInfo.get('names')!.setValue(this.Payment.names);
    this.formBasicInfo.get('lastnames')!.setValue(this.Payment.lastnames);
    this.formBasicInfo.get('email')!.setValue(this.Payment.email);
    this.formBasicInfo.get('sexo')!.setValue(this.Payment.sexo);
    this.formBasicInfo.get('date_birth')!.setValue(this.Payment.date_birth);
    this.formBasicInfo.get('date_admission')!.setValue(this.Payment.date_admission);
  }

  createPayment(): void {
    if (this.formBasicInfo.valid) {
      const PaymentPersistence: Payment = {};
      PaymentPersistence.id = 0;
      PaymentPersistence.dni = this.formBasicInfo.get('dni')?.value;
      PaymentPersistence.Paymentname = this.formBasicInfo.get('Paymentname')?.value;
      PaymentPersistence.names = this.formBasicInfo.get('names')?.value;
      PaymentPersistence.lastnames = this.formBasicInfo.get('lastnames')?.value;
      PaymentPersistence.email = this.formBasicInfo.get('email')?.value;
      PaymentPersistence.sexo = String(this.formBasicInfo.get('sexo')?.value);
      PaymentPersistence.date_birth = new Date(String(this.formBasicInfo.get('date_birth')?.value)).toISOString();
      PaymentPersistence.date_admission = new Date(String(this.formBasicInfo.get('date_admission')?.value)).toISOString();
      //this.subject = PaymentPersistence;
      //this.returnPayment.emit(this.subject)
      this._subscription.add(
        this.PaymentService.createPayment(PaymentPersistence).subscribe(
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

  private getPaymentByID(PaymentId: string): void {
    this.PaymentService.getPaymentByID(PaymentId).subscribe((resp) => {
      if (resp.error) {
        this.addToast({
          type: 'error',
          message: resp.msg,
          life: 5000,
        });
        // this.notifyPayment('error', '', resp.msg, 5000);
      } else {
        this.Payment = resp.data;
        // this.findPaymentSecurityEntity();
      }
    });
  }

  public returnError(nameControl: string) {
    if ((!this.formBasicInfo.get(nameControl)?.hasError('required')|| this.formBasicInfo.get(nameControl)?.touched) && (this.formBasicInfo.get(nameControl)?.value == '')) {
      return true;
    }
    return false;
  }

  private updatePayment(): void {
    if (this.formBasicInfo.valid) {
      const PaymentPersistence: Payment = {};
      PaymentPersistence.matricula = this.Payment.matricula;
      PaymentPersistence.dni = this.formBasicInfo.get('dni')?.value;
      PaymentPersistence.Paymentname = this.formBasicInfo.get('Paymentname')?.value;
      PaymentPersistence.names = this.formBasicInfo.get('names')?.value;
      PaymentPersistence.lastnames = this.formBasicInfo.get('lastnames')?.value;
      PaymentPersistence.email = this.formBasicInfo.get('email')?.value;
      PaymentPersistence.sexo = String(this.formBasicInfo.get('sexo')?.value);
      PaymentPersistence.date_birth = new Date(String(this.formBasicInfo.get('date_birth')?.value)).toISOString();
      PaymentPersistence.date_admission = new Date(String(this.formBasicInfo.get('date_admission')?.value)).toISOString();
      this.PaymentService.updatePayment(PaymentPersistence).subscribe((resp: any) => {
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

  public returnExistPayment(): boolean {
    if (Object.keys(this.Payment).length) {
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
  get Paymentname() {
    return this.formBasicInfo.get('Paymentname');
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
