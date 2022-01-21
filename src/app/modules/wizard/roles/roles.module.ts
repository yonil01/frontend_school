import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles.component';
import {UiModule} from "@app/ui/ui.module";


@NgModule({
  declarations: [
    RolesComponent
  ],
    imports: [
        CommonModule,
        RolesRoutingModule,
        UiModule
    ]
})
export class RolesModule { }
