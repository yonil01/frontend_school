import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserListComponent} from "@app/modules/administration/modules/users/pages/user-list/user-list.component";
import {UserCrudComponent} from "@app/modules/administration/modules/users/pages/user-crud/user-crud.component";
import {DatasetListComponent} from "@app/modules/administration/modules/datasets/pages/dataset-list/dataset-list.component";
import {DatasetCrudComponent} from "@app/modules/administration/modules/datasets/pages/dataset-crud/dataset-crud.component";
import {DatasetConfigComponent} from "@app/modules/administration/modules/datasets/pages/dataset-config/dataset-config.component";

const routes: Routes = [
  {path: '', redirectTo: 'list'},
  {path: 'list', component: DatasetListComponent},
  {path: 'detail', component: DatasetCrudComponent},
  {path: 'config', component: DatasetConfigComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DatasetsRoutingModule { }
