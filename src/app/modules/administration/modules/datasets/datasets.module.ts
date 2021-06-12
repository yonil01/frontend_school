import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatasetsRoutingModule } from './datasets-routing.module';
import { DatasetsComponent } from './datasets.component';
import { DatasetListComponent } from './pages/dataset-list/dataset-list.component';
import { DatasetCrudComponent } from './pages/dataset-crud/dataset-crud.component';
import { DatasetConfigComponent } from './pages/dataset-config/dataset-config.component';
import { DatasetConfigCrudComponent } from './pages/dataset-config/components/dataset-config-crud/dataset-config-crud.component';


@NgModule({
  declarations: [
    DatasetsComponent,
    DatasetListComponent,
    DatasetCrudComponent,
    DatasetConfigComponent,
    DatasetConfigCrudComponent
  ],
  imports: [
    CommonModule,
    DatasetsRoutingModule
  ]
})
export class DatasetsModule { }
