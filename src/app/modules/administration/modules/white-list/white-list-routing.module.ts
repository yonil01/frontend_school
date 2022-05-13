import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {WhiteListPageComponent} from "@app/modules/administration/modules/white-list/pages/white-list-page/white-list-page.component";

const routes: Routes = [
  {path: '', redirectTo: 'list',},
  {path: 'list', component: WhiteListPageComponent,}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WhiteListRoutingModule { }
