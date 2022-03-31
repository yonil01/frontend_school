import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DatasetListComponent} from "@app/modules/administration/modules/datasets/pages/dataset-list/dataset-list.component";
import {DatasetConfigComponent} from "@app/modules/administration/modules/datasets/pages/dataset-config/dataset-config.component";
import { DatasetCreateEditComponent } from './pages/dataset-create-edit/dataset-create-edit.component';
import {DatasetConfigListComponent} from "@app/modules/administration/modules/datasets/pages/dataset-config/components/dataset-config-list/dataset-config-list.component";
import { DatasetConfigCreateEditComponent } from './pages/dataset-config/components/dataset-config-create-edit/dataset-config-create-edit.component';

const routes: Routes = [
  {path: '', redirectTo: 'list'},
  {path: 'list', component: DatasetListComponent},
  {path: 'create-edit', component: DatasetCreateEditComponent},
  {path: 'detail', component: DatasetConfigListComponent},
  {path: 'detail/create-edit', component: DatasetConfigCreateEditComponent},
  {path: 'config', component: DatasetConfigComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DatasetsRoutingModule { }
