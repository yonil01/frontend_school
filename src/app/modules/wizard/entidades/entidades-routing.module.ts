import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EntidadesComponent} from "@app/modules/wizard/entidades/entidades.component";

const routes: Routes = [
  {
    path: '',
    component: EntidadesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntidadesRoutingModule { }
