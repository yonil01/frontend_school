import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcessRoutingModule } from './process-routing.module';
import { ProcessComponent } from './process/process.component';
import { ProcessListComponent } from './process/Pages/process-list/process-list.component';
import {UiModule} from "@app/ui/ui.module";
import { ProcessCreateComponent } from './process/Pages/process-create/process-create.component';
import { ProcessShowComponent } from './process/Pages/process-show/process-show.component';


@NgModule({
  declarations: [
    ProcessComponent,
    ProcessListComponent,
    ProcessCreateComponent,
    ProcessShowComponent
  ],
  imports: [
    CommonModule,
    ProcessRoutingModule,
    UiModule
  ]
})
export class ProcessModule { }
