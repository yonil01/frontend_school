import { Component, OnInit } from '@angular/core';
import {TableModel} from "@app/ui/components/table/model/table.model";
import {Router} from "@angular/router";
import {styleTablePayment} from "@app/modules/administration/modules/payments/models/model-payment/constans-payment";
import {PaymentsService} from "@app/modules/administration/modules/payments/service/payment/payments.service";
import {Payment} from "@app/core/models";
import {PaymentSelect} from "@app/modules/administration/modules/payments/models/payment-crud-model/payment-crud-constans";

@Component({
  selector: 'app-teacher-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss']
})
export class PaymentListComponent implements OnInit {
  public styleTable: TableModel = styleTablePayment;
  public Payments: Payment[] = [];
  public PaymentSelect: any = PaymentSelect;
  constructor(private router: Router,private PaymentService: PaymentsService,) { }

  ngOnInit(): void {

    this.getPayments();
  }

  public  getPayments(): void {
    this.styleTable.dataSource = [];
    this.PaymentService.getPaymentsByRolesAllow().subscribe((res) => {
      if (!res.error) {
        this.Payments = res.data;
        this.Payments.forEach((Payment: any) => {
          const newPayment = {
            id: Payment.id,
            value1: Payment.identification_number,
            value2: Payment.last_name,
            value3: Payment.email_notifications,
            value4: Payment.status === 0 ? 'Desbloqueado' : 'Bloqueado',
            value5: Payment.roles ? Payment.roles[0].name : '',
          }
          this.styleTable.dataSource?.push(newPayment);
        })
      }
    });
  }

  public eventTableOption(data:any): void {
    if (data.type === 'edit') {
      this.router.navigate(['/admin/subject/detail'])
    }
    if (data.type === 'normally') {
      this.router.navigate(['/wizard/dymanic-forms/configuration'])
    }
    if (data.type === 'normally') {
      this.router.navigate(['/wizard/dymanic-forms/configuration'])
    }
    if (data.type === 'normally') {
      this.router.navigate(['/wizard/dymanic-forms/configuration'])
    }
  }
}
