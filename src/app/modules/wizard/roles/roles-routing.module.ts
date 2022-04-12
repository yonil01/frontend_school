import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesListComponent } from './pages/roles-list/roles-list.component';
import {RolesCreateComponent} from "@app/modules/wizard/roles/pages/roles-create/roles-create.component";

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
    path: 'manager',
    loadChildren: () => import('./pages/roles-manager/roles-manager.module').then(m => m.RolesManagerModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
