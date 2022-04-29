import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministrationComponent } from './administration.component';
import {MessagesModule} from "@app/modules/administration/modules/messages/messages.module";
import {UiModule} from "@app/ui/ui.module";


@NgModule({
  declarations: [
    AdministrationComponent,
  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    MessagesModule,
    UiModule
  ]
})
export class AdministrationModule { }
