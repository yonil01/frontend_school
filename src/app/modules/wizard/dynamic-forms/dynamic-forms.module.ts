import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicFormsRoutingModule } from './dynamic-forms-routing.module';
import { DynamicFormsComponent } from './dynamic-forms.component';


@NgModule({
  declarations: [
    DynamicFormsComponent
  ],
  imports: [
    CommonModule,
    DynamicFormsRoutingModule
  ]
})
export class DynamicFormsModule { }
