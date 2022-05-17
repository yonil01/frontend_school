import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ConsoleNotifyComponent} from "@app/modules/administration/modules/console-notify/console-notify.component";

const routes: Routes = [
  {path: '', component: ConsoleNotifyComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsoleNotifyRoutingModule { }
