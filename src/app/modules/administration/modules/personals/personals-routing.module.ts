import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PersonalsComponent} from "@app/modules/administration/modules/personals/personals.component";

const routes: Routes = [
  {path: ':id', component: PersonalsComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalsRoutingModule { }
