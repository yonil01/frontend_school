import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministrationComponent } from './administration.component';
import {UiModule} from "@app/ui/ui.module";


@NgModule({
  declarations: [
    AdministrationComponent
  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    UiModule
  ]
})
export class AdministrationModule { }
