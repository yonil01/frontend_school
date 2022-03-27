import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesDetailComponent } from './pages/roles-detail/roles-detail.component';
import {RolesManagerRoutingModule} from "@app/modules/wizard/roles/pages/roles-manager/roles-manager-routing.module";
import {UiModule} from "@app/ui/ui.module";
import { RolesTypedocComponent } from './pages/roles-typedoc/roles-typedoc.component';
import { RolesPrivilegeComponent } from './pages/roles-privilege/roles-privilege.component';
import { RolesSecurityPoliticComponent } from './pages/roles-security-politic/roles-security-politic.component';
import { RolesDisabledDatesComponent } from './pages/roles-disabled-dates/roles-disabled-dates.component';
import { RolesAttributeSecurityComponent } from './pages/roles-attribute-security/roles-attribute-security.component';
import { RolesAllowedRolesComponent } from './pages/roles-allowed-roles/roles-allowed-roles.component';
import {ToastModule} from "ecapture-ng-ui";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    RolesDetailComponent,
    RolesTypedocComponent,
    RolesPrivilegeComponent,
    RolesSecurityPoliticComponent,
    RolesDisabledDatesComponent,
    RolesAttributeSecurityComponent,
    RolesAllowedRolesComponent
  ],
    imports: [
        RolesManagerRoutingModule,
        CommonModule,
        UiModule,
        ToastModule,
        ReactiveFormsModule
    ]
})
export class RolesManagerModule { }
