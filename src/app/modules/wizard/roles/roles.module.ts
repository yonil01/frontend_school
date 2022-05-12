import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles.component';
import {UiModule} from "@app/ui/ui.module";
import { RolesListComponent } from './pages/roles-list/roles-list.component';
import { RolesCreateComponent } from './pages/roles-create/roles-create.component';
import { RolesManagerComponent } from './pages/roles-manager/roles-manager.component';
import {ToastModule} from "ecapture-ng-ui";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  declarations: [
    RolesComponent,
    RolesListComponent,
    RolesCreateComponent,
    RolesManagerComponent
  ],
    imports: [
        CommonModule,
        RolesRoutingModule,
        UiModule,
        ToastModule,
        ReactiveFormsModule,
        TranslateModule
    ]
})
export class RolesModule { }
