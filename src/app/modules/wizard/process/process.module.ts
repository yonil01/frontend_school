import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProcessRoutingModule} from './process-routing.module';
import {ProcessComponent} from './process/process.component';
import {ProcessListComponent} from './process/Pages/process-list/process-list.component';
import {UiModule} from "@app/ui/ui.module";
import {ProcessCreateComponent} from './process/Pages/process-create/process-create.component';
import {ProcessShowComponent} from './process/Pages/process-show/process-show.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IconsModule, ToastModule} from "ecapture-ng-ui";
import {MatMenuModule} from "@angular/material/menu";
import {ConfigComponent} from "@app/modules/wizard/process/process/components/config/config.component";
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  declarations: [
    ProcessComponent,
    ProcessListComponent,
    ProcessCreateComponent,
    ProcessShowComponent,
    ConfigComponent
  ],
  imports: [
    CommonModule,
    ProcessRoutingModule,
    UiModule,
    ReactiveFormsModule,
    FormsModule,
    IconsModule,
    ToastModule,
    MatMenuModule,
    TranslateModule
  ]
})
export class ProcessModule {
}
