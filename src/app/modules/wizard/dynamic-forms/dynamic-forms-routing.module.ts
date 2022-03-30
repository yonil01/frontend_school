import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
// import * as path from "path";
import {DynamicFormsComponent} from "@app/modules/wizard/dynamic-forms/dynamic-forms.component";
import {FormsComponent} from "@app/modules/wizard/dynamic-forms/components/forms/forms.component";
import {EditComponent} from "@app/modules/wizard/dynamic-forms/components/edit/edit.component";
import {
  CreateContainerComponent
} from "@app/modules/wizard/dynamic-forms/components/create-container/create-container.component";
import {
  ConfigurationComponent
} from "@app/modules/wizard/dynamic-forms/container/configuration/configuration.component";

const routes: Routes = [
  {
    path: '', component: DynamicFormsComponent,
  },
  {
    path:'forms', component: FormsComponent
  },
  {
    path: 'edit', component: EditComponent
  },
  {
    path: 'create', component: CreateContainerComponent
  },
  {
    path: 'configuration', component: ConfigurationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DynamicFormsRoutingModule {
}
