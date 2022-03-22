import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DynamicFormsListComponent} from "@app/modules/wizard/dynamic-forms/pages/dynamic-forms-list/dynamic-forms-list.component";
import { DynamicFormsDetailComponent } from './pages/dynamic-forms-detail/dynamic-forms-detail.component';
import {DynamicFormsContainerCreateComponent} from "@app/modules/wizard/dynamic-forms/pages/dynamic-forms-container-create/dynamic-forms-container-create.component";
import {DynamicFormsContainerEditComponent} from "@app/modules/wizard/dynamic-forms/pages/dynamic-forms-container-edit/dynamic-forms-container-edit.component";

const routes: Routes = [
  {
    path: '', component: DynamicFormsListComponent
  },
  {
    path: 'detail', component: DynamicFormsDetailComponent
  },
  {
    path: 'container/create', component: DynamicFormsContainerCreateComponent
  },
  {
    path: 'container/edit', component: DynamicFormsContainerEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DynamicFormsRoutingModule {
}
