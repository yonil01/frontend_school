import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsoleNotifyRoutingModule } from './console-notify-routing.module';
import {ConsoleNotifyComponent} from "@app/modules/administration/modules/console-notify/console-notify.component";
import {UiModule} from "@app/ui/ui.module";
import {ToastModule} from "ecapture-ng-ui";


@NgModule({
  declarations: [
    ConsoleNotifyComponent
  ],
    imports: [
        CommonModule,
        ConsoleNotifyRoutingModule,
        UiModule,
        ToastModule
    ]
})
export class ConsoleNotifyModule { }
