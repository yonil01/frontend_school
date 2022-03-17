import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesListComponent } from './pages/roles-list/roles-list.component';
import {RolesCreateComponent} from "@app/modules/wizard/roles/pages/roles-create/roles-create.component";
import {RolesEditComponent} from "@app/modules/wizard/roles/pages/roles-edit/roles-edit.component";

const routes: Routes = [
  {
    path: '',
    component: RolesListComponent
  },
  {
    path: 'create',
    component: RolesCreateComponent
  },
  {
    path: 'edit',
    component: RolesEditComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
