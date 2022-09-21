import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GradoComponent} from "@app/modules/administration/modules/grado/grado.component";

const routes: Routes = [{ path: ':id', component: GradoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GradoRoutingModule {}
