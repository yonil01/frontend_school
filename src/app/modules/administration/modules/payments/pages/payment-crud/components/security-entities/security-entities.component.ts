import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataDrop, DropdownModel} from "ecapture-ng-ui/lib/modules/dropdown/models/dropdown";
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import {Data, TableModel} from "@app/ui/components/table/model/table.model";
import {
  styleDropdown,
  styleTableEntitySegurity
} from "@app/modules/administration/modules/payments/models/model-segurity-entities/constans-segurity-entities";
import {StepModel} from "@app/ui/components/step/models/step-vertical-model";
import {CrudModel} from "@app/modules/administration/modules/payments/models/payment-crud-model/payment-crud-constans";
import {
  NewPaymentAttribute,
  NewPaymentSecurityEntity,
  RoleAttribute,
  SecurityEntity,
  Payment, PaymentAttribute,
  PaymentSecurityEntity
} from "@app/core/models";
import {PaymentsService} from "@app/modules/administration/modules/payments/service/payment/payments.service";
import {FormControl} from "@angular/forms";
import {LocalStorageService} from "@app/core/services/local-storage/local-storage.service";
import {atRule} from "postcss";
import {showLoader} from "@app/modules/administration/modules/payments/models/model-payment/constans-payment";

@Component({
  selector: 'app-security-entities',
  templateUrl: './security-entities.component.html',
  styleUrls: ['./security-entities.component.scss']
})
export class SecurityEntitiesComponent implements OnInit {
  @Input() Payment: Payment;
  public styleDropdown: DropdownModel = styleDropdown;
  public styleTable: TableModel = styleTableEntitySegurity;
  public styleStep: StepModel = CrudModel;
  public securityEntities: SecurityEntity[] = [];
  public dataDropIdentity: DataDrop[];
  public dataDropAttribute: DataDrop[];
  public securityEntitySelected: PaymentSecurityEntity = {};
  public PaymentSecurityEntitySelected: PaymentSecurityEntity;
  public showCreateSecurityEntity: boolean = false;
  public securityEntityAttributeSelectedForm = new FormControl('');
  public securityEntitiesSelectedForm = new FormControl('');
  public securityEntityAttributeSelected: RoleAttribute;
  public showCreateSecurityEntityAttribute: boolean = false;
  public showLoader: any = showLoader;
  public isBlockPage: boolean = false;
  @Output() showToast = new EventEmitter<any>();
  constructor(private PaymentService: PaymentsService,
              private localStorageService: LocalStorageService,) {
    this.Payment = {};
    this.dataDropIdentity = [];
    this.dataDropAttribute = [];
    this.PaymentSecurityEntitySelected = {};
    this.securityEntityAttributeSelected = {};
  }

  ngOnInit(): void {
    this.getPaymentByID(this.Payment.dni!);
    this.securityEntitiesSelectedForm.valueChanges.subscribe((securityEntity: SecurityEntity) => {
      this.securityEntitySelected = securityEntity;
      this.dataDropAttribute = [];
      this.securityEntitySelected.attributes?.forEach((attribute: any) => {
        this.dataDropAttribute.push({
          label: String(attribute.attribute.name + ' ' + '-' + ' ' + attribute.value),
          value: attribute,
        })
      });
      this.findPaymentSecurityEntity();
      this.securityEntityAttributeSelectedForm.setValue(null);
    });

    this.securityEntityAttributeSelectedForm.valueChanges.subscribe((securityEntityAttribute: RoleAttribute) => {
      this.securityEntityAttributeSelected = securityEntityAttribute;
      this.findPaymentSecurityEntity();
    });
  };

  public eventTableOption(data:any): void {
    if (data.type === 'Delete') {
      this.deleteSecurityEntityAttribute(data.value);
    }
    if (data.type === 'Delete Max') {
      this.deleteSecurityEntity(data.value);
    }
  }


  private getPaymentSecurityEntityByID(PaymentId: string): void {
    this.dataDropIdentity = [];
    this.PaymentService.getPaymentByID(PaymentId).subscribe((resp) => {
      if (resp.error) {
        this.addToast({
          type: 'error',
          message: resp.msg,
          life: 5000,
        });
        /*this.notifyPayment('error', '', resp.msg, 5000);*/
      } else {
        this.securityEntities = resp.data.security_entities;
        if (this.securityEntities) {
          this.securityEntities.forEach((item: any) => {
            const newData = {
              label: item.entity.name,
              value: item
            }
            this.dataDropIdentity.push(newData);
          })
        }
      }
    });
  }


  public backStep(index: number) {
    this.styleStep.dataSourceStep.forEach((item: any, i:number) => {
      if (index === i) {
        item.status = 'Completed'
      }
      if ((index - 1) === i) {
        item.focus = true;
      } else {
        item.focus = false;
      }
    })
  }

  private getDataTable(Payment: Payment) {
    this.styleTable.dataSources = [];
    if (Payment.status) {
      /*subject.status.forEach((entity: any) => {
        const newData: Data = {
          name: entity.entity.name,
          value: entity,
          datasource: []
        }
        if (entity.attributes) {
          entity.attributes.forEach((attribute: any) => {
            const newAttribute = {
              value: attribute,
              value1: attribute.attribute.name,
              value2: attribute.value
            }
            newData.datasource.push(newAttribute);
          })
        }
        this.styleTable.dataSources?.push(newData);
      })*/
    }

  }

  createSecurityEntity(): void {
    const securityEntityPersistence: NewPaymentSecurityEntity = {
      id: uuidv4().toLowerCase(),
      entity: this.securityEntitiesSelectedForm.value.entity.id,
      Payment_id: this.Payment.dni?.toLowerCase(),
    };
    this.PaymentService.createPaymentsSecurityEntity(securityEntityPersistence).subscribe((resp) => {
      if (resp.error) {
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
        this.getPaymentByID(this.Payment.dni!.toLowerCase());
        this.showCreateSecurityEntity = false;
      }
    });
  }

  private getPaymentByID(PaymentId: string): void {
    this.isBlockPage = true;
    this.PaymentService.getPaymentByID(PaymentId).subscribe((resp) => {
      if (resp.error) {
        this.isBlockPage = false;
        this.addToast({
          type: 'error',
          message: resp.msg,
          life: 5000,
        });
      } else {
        this.Payment = resp.data;
        //this.getPaymentSecurityEntityByID(this.localStorageService.getPaymentId().toLowerCase());
        this.findPaymentSecurityEntity();
        this.getDataTable(this.Payment);
      }
    });
  }
  private findPaymentSecurityEntity(): void {
    if (this.securityEntitySelected) {
      /*this.PaymentSecurityEntitySelected = this.subject.status?.find(
        (se) => se.entity?.id!.toLowerCase() === this.securityEntitySelected.entity?.id!.toLowerCase(),
      )!;*/
      if (this.PaymentSecurityEntitySelected) {
        this.showCreateSecurityEntity = false;
      } else {
        this.showCreateSecurityEntity = true;
      }
    } else {
      this.PaymentSecurityEntitySelected = {};
      this.showCreateSecurityEntity = false;
    }

    this.isBlockPage = false;
  }

  deleteSecurityEntity(securityEntity: SecurityEntity): void {
    this.PaymentService.deletePaymentsSecurityEntity(securityEntity.id!.toLowerCase()).subscribe((resp) => {
      if (resp.error) {
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
        this.getPaymentByID(this.Payment.dni!.toLowerCase());
      }
    });
  }

  createSecurityEntityAttribute(): void {
    const securityEntityPersistence: NewPaymentAttribute = {
      id: uuidv4().toLowerCase(),
      attribute: this.securityEntityAttributeSelectedForm.value.attribute.id,
      value: this.securityEntityAttributeSelected.value,
      enable: true,
      Payments_security_entities_id: this.PaymentSecurityEntitySelected.id,
    };
    this.PaymentService.createPaymentsAttribute(securityEntityPersistence).subscribe((resp) => {
      if (resp.error) {
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
        this.getPaymentByID(this.Payment.dni!.toLowerCase());
        this.showCreateSecurityEntityAttribute = false;
      }
    });
  }

  deleteSecurityEntityAttribute(PaymentAttribute: PaymentAttribute): void {
    this.PaymentService.deletePaymentsAttributey(PaymentAttribute.id!.toLowerCase()).subscribe((resp) => {
      if (resp.error) {
        this.addToast({
          type: 'success',
          message: resp.msg,
          life: 5000,
        });
      } else {
        this.addToast({
          type: 'success',
          message: resp.msg,
          life: 5000,
        });
        this.dataDropAttribute = [];
        this.getPaymentByID(this.Payment.dni!.toLowerCase());
      }
    });
  }

  public addToast(data: any): void {
    this.showToast.emit({type: data.type, message: data.message, life: data.life});
  }

}
