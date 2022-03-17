import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesDetailComponent } from './pages/roles-detail/roles-detail.component';
import {RolesManagerRoutingModule} from "@app/modules/wizard/roles/pages/roles-manager/roles-manager-routing.module";



@NgModule({
  declarations: [
    RolesDetailComponent
  ],
  imports: [
    RolesManagerRoutingModule,
    CommonModule
  ]
})
export class RolesManagerModule { }
