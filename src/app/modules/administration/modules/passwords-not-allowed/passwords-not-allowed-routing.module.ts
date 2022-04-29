import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserListComponent} from "@app/modules/administration/modules/users/pages/user-list/user-list.component";
import {UserCrudComponent} from "@app/modules/administration/modules/users/pages/user-crud/user-crud.component";
import {PasswordsNotAllowedListComponent} from "@app/modules/administration/modules/passwords-not-allowed/pages/passwords-not-allowed-list/passwords-not-allowed-list.component";
import {PasswordsNotAllowedCrudComponent} from "@app/modules/administration/modules/passwords-not-allowed/pages/passwords-not-allowed-crud/passwords-not-allowed-crud.component";

const routes: Routes = [
  {path: '', redirectTo: 'list'},
  {path: 'list', component: PasswordsNotAllowedListComponent},
  {path: 'crud', component: PasswordsNotAllowedCrudComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PasswordsNotAllowedRoutingModule { }
