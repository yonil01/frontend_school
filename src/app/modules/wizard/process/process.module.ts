import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcessRoutingModule } from './process-routing.module';
import { ProcessComponent } from './process/process.component';
import { ProcessListComponent } from './process/Pages/process-list/process-list.component';
import {UiModule} from "@app/ui/ui.module";
import { ProcessCreateComponent } from './process/Pages/process-create/process-create.component';


@NgModule({
  declarations: [
    ProcessComponent,
    ProcessListComponent,
    ProcessCreateComponent
  ],
  imports: [
    CommonModule,
    ProcessRoutingModule,
    UiModule
  ]
})
export class ProcessModule { }
