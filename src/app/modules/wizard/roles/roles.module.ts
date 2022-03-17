import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles.component';
import {UiModule} from "@app/ui/ui.module";
import { RolesListComponent } from './pages/roles-list/roles-list.component';
import { RolesCreateComponent } from './pages/roles-create/roles-create.component';
import { RolesEditComponent } from './pages/roles-edit/roles-edit.component';


@NgModule({
  declarations: [
    RolesComponent,
    RolesListComponent,
    RolesCreateComponent,
    RolesEditComponent
  ],
    imports: [
        CommonModule,
        RolesRoutingModule,
        UiModule
    ]
})
export class RolesModule { }
