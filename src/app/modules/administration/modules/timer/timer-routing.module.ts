import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TimerComponent} from "@app/modules/administration/modules/timer/timer.component";

const routes: Routes = [
  {path: '', component: TimerComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimerRoutingModule { }
