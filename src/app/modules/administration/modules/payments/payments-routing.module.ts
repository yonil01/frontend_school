import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PaymentListComponent} from "@app/modules/administration/modules/payments/pages/payment-list/payment-list.component";
import {PaymentCrudComponent} from "@app/modules/administration/modules/payments/pages/payment-crud/payment-crud.component";
import {
  BasicInformationComponent
} from "@app/modules/administration/modules/payments/pages/payment-crud/components/basic-information/basic-information.component";
import {RoleComponent} from "@app/modules/administration/modules/payments/pages/payment-crud/components/role/role.component";
import {PaymentsComponent} from "@app/modules/administration/modules/payments/payments.component";

const routes: Routes = [
  {path: ':id', component: PaymentsComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsRoutingModule { }
