import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WizardRoutingModule } from './wizard-routing.module';
import { WizardComponent } from './wizard.component';


@NgModule({
  declarations: [
    WizardComponent
  ],
  imports: [
    CommonModule,
    WizardRoutingModule
  ]
})
export class WizardModule { }
