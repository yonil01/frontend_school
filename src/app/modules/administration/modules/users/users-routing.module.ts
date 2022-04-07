import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserListComponent} from "@app/modules/administration/modules/users/pages/user-list/user-list.component";
import {UserCrudComponent} from "@app/modules/administration/modules/users/pages/user-crud/user-crud.component";
import {
  BasicInformationComponent
} from "@app/modules/administration/modules/users/pages/user-crud/components/basic-information/basic-information.component";
import {RoleComponent} from "@app/modules/administration/modules/users/pages/user-crud/components/role/role.component";
import {UsersComponent} from "@app/modules/administration/modules/users/users.component";

const routes: Routes = [
  {path: '', component: UsersComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
