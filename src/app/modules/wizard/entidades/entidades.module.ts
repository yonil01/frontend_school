import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EntidadesRoutingModule} from './entidades-routing.module';
import {EntidadesComponent} from './entidades.component';
import {UiModule} from "@app/ui/ui.module";


@NgModule({
  declarations: [
    EntidadesComponent
  ],
  imports: [
    CommonModule,
    EntidadesRoutingModule,
    UiModule
  ]
})
export class EntidadesModule {
}
