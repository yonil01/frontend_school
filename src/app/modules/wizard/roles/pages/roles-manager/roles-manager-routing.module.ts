import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RolesDetailComponent} from "@app/modules/wizard/roles/pages/roles-manager/pages/roles-detail/roles-detail.component";
import { RolesTypedocComponent } from './pages/roles-typedoc/roles-typedoc.component';
import {RolesPrivilegeComponent} from "@app/modules/wizard/roles/pages/roles-manager/pages/roles-privilege/roles-privilege.component";
import {RolesSecurityPoliticComponent} from "@app/modules/wizard/roles/pages/roles-manager/pages/roles-security-politic/roles-security-politic.component";
import { RolesDisabledDatesComponent } from './pages/roles-disabled-dates/roles-disabled-dates.component';
import { RolesAttributeSecurityComponent } from './pages/roles-attribute-security/roles-attribute-security.component';
import { RolesAllowedRolesComponent } from './pages/roles-allowed-roles/roles-allowed-roles.component';

const routes: Routes = [
  {
    path: '',
    component: RolesDetailComponent,
  },
  {
    path: 'typedoc',
    component: RolesTypedocComponent,
  },
  {
    path: 'privilege',
    component: RolesPrivilegeComponent,
  },
  {
    path: 'politics',
    component: RolesSecurityPoliticComponent,
  },
  {
    path: 'dates',
    component: RolesDisabledDatesComponent,
  },
  {
    path: 'security',
    component: RolesAttributeSecurityComponent,
  },
  {
    path: 'roles',
    component: RolesAllowedRolesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesManagerRoutingModule { }
