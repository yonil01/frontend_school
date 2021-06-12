import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntidadesRoutingModule } from './entidades-routing.module';
import { EntidadesComponent } from './entidades.component';


@NgModule({
  declarations: [
    EntidadesComponent
  ],
  imports: [
    CommonModule,
    EntidadesRoutingModule
  ]
})
export class EntidadesModule { }
