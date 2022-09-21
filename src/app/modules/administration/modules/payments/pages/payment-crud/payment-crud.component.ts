import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  CrudModel
} from "@app/modules/administration/modules/payments/models/payment-crud-model/payment-crud-constans";
import {StepModel} from "@app/ui/components/step/models/step-vertical-model";
import {Router} from "@angular/router";
import {Payment} from "@app/core/models";

@Component({
  selector: 'app-subject-crud',
  templateUrl: './payment-crud.component.html',
  styleUrls: ['./payment-crud.component.scss']
})
export class PaymentCrudComponent implements OnInit {
  public styleCrud: StepModel = CrudModel;
  @Input() Payment: Payment;
  @Input() isEdit: boolean;
  @Output() showToast = new EventEmitter<any>();

  constructor(private router: Router) {
    this.Payment = {};
    this.isEdit = false;
  }

  ngOnInit(): void {
    if (Object.keys(this.Payment).length) {
      this.showDisabledStep(this.Payment);
    }
  }

  public valuePayment(Payment: Payment): void {
    this.Payment = Payment;
  }

  public showToastAdd(data: any): any {
    this.showToast.emit(data);
  }

  public showDisabledStep(Payment: Payment): void {
    this.styleCrud.dataSourceStep.forEach((item: any, i: number) => {
      if (i === (this.styleCrud.dataSourceStep.length - 1)) {
        if (Payment.dni !== null) {
          item.status = 'Completed';
          item.block = false;
        }
      } else {
        item.status = 'Completed';
        item.block = false;
      }
    })
  }

}
