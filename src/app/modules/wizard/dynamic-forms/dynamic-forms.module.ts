import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicFormsRoutingModule } from './dynamic-forms-routing.module';
import { DynamicFormsComponent } from './dynamic-forms.component';
import {UiModule} from "@app/ui/ui.module";


@NgModule({
  declarations: [
    DynamicFormsComponent
  ],
    imports: [
        CommonModule,
        DynamicFormsRoutingModule,
        UiModule
    ]
})
export class DynamicFormsModule { }
