import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessagesRoutingModule } from './messages-routing.module';
import { MessagesComponent } from './messages.component';
import { MessagesListComponent } from './pages/messages-list/messages-list.component';
import { MessagesCrudComponent } from './pages/messages-crud/messages-crud.component';


@NgModule({
  declarations: [
    MessagesComponent,
    MessagesListComponent,
    MessagesCrudComponent
  ],
  imports: [
    CommonModule,
    MessagesRoutingModule
  ]
})
export class MessagesModule { }
