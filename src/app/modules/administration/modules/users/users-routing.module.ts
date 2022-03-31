import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserListComponent} from "@app/modules/administration/modules/users/pages/user-list/user-list.component";
import {UserCrudComponent} from "@app/modules/administration/modules/users/pages/user-crud/user-crud.component";
import { BasicInformationComponent } from './pages/user-crud/components/basic-information/basic-information.component';
import {RoleComponent} from "@app/modules/administration/modules/users/pages/user-crud/components/role/role.component";
import {SecurityEntitiesComponent} from "@app/modules/administration/modules/users/pages/user-crud/components/security-entities/security-entities.component";

const routes: Routes = [
  {path: '', redirectTo: 'list'},
  {path: 'list', component: UserListComponent},
  {path: 'detail', component: UserCrudComponent},
  {path: 'create/info-basic', component: BasicInformationComponent},
  {path: 'create/role', component: RoleComponent},
  {path: 'create/entities', component: SecurityEntitiesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
