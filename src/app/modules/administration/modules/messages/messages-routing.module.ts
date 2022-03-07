import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MessagesListComponent} from "@app/modules/administration/modules/messages/pages/messages-list/messages-list.component";
import {MessagesCrudComponent} from "@app/modules/administration/modules/messages/pages/messages-crud/messages-crud.component";

const routes: Routes = [
  {path: '', redirectTo: 'list'},
  {path: 'list', component: MessagesListComponent},
  {path: 'detail', component: MessagesCrudComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessagesRoutingModule { }
