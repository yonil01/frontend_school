import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ParameterListComponent} from "@app/modules/administration/modules/parameters/pages/parameter-list/parameter-list.component";
import {ParameterCrudComponent} from "@app/modules/administration/modules/parameters/pages/parameter-crud/parameter-crud.component";
const routes: Routes = [
  {path: '', redirectTo: 'list'},
  {path: 'list', component: ParameterListComponent},
  {path: 'crud', component: ParameterCrudComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametersRoutingModule { }
