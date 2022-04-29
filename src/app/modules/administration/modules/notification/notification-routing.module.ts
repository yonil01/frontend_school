import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NotificationComponent} from "@app/modules/administration/modules/notification/notification.component";

const routes: Routes = [
  {path: '', component: NotificationComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationRoutingModule { }
