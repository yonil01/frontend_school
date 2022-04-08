import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessagesRoutingModule } from './messages-routing.module';
import { MessagesComponent } from './messages.component';
import { MessagesListComponent } from './pages/messages-list/messages-list.component';
import { MessagesCrudComponent } from './pages/messages-crud/messages-crud.component';
import {UiModule} from "@app/ui/ui.module";
import { MessagesCreateComponent } from './pages/messages-create/messages-create.component';
import {MessageServices} from "@app/modules/administration/services/message/message.service";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    MessagesComponent,
    MessagesListComponent,
    MessagesCrudComponent,
    MessagesCreateComponent
  ],
  imports: [
    CommonModule,
    MessagesRoutingModule,
    UiModule,
    ReactiveFormsModule
  ],
  providers: [MessageServices],
  exports: [
    MessagesComponent,
    MessagesListComponent,
    MessagesCrudComponent
  ]
})
export class MessagesModule { }
