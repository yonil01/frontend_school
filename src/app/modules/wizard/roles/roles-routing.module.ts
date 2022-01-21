import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RoleComponent} from "@app/modules/administration/modules/users/pages/user-crud/components/role/role.component";

const routes: Routes = [
  {
    path: '',
    component: RoleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
