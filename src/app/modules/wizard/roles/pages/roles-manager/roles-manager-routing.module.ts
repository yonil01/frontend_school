import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RolesDetailComponent} from "@app/modules/wizard/roles/pages/roles-manager/pages/roles-detail/roles-detail.component";

const routes: Routes = [
  {
    path: '',
    component: RolesDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesManagerRoutingModule { }
