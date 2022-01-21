import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
// import * as path from "path";
import {DynamicFormsComponent} from "@app/modules/wizard/dynamic-forms/dynamic-forms.component";

const routes: Routes = [
  {
    path: '', component: DynamicFormsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DynamicFormsRoutingModule {
}
