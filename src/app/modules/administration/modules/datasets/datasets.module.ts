import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatasetsRoutingModule } from './datasets-routing.module';
import { DatasetsComponent } from './datasets.component';
import { DatasetListComponent } from './pages/dataset-list/dataset-list.component';
import { DatasetConfigComponent } from './pages/dataset-config/dataset-config.component';
import {UiModule} from "@app/ui/ui.module";
import { DatasetCreateEditComponent } from './pages/dataset-create-edit/dataset-create-edit.component';
import { DatasetConfigListComponent } from './pages/dataset-config/components/dataset-config-list/dataset-config-list.component';
import { DatasetConfigCreateEditComponent } from './pages/dataset-config/components/dataset-config-create-edit/dataset-config-create-edit.component';
import {ToastModule} from "ecapture-ng-ui";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    DatasetsComponent,
    DatasetListComponent,
    DatasetConfigComponent,
    DatasetCreateEditComponent,
    DatasetConfigListComponent,
    DatasetConfigCreateEditComponent
  ],
  imports: [
    CommonModule,
    DatasetsRoutingModule,
    UiModule,
    ToastModule,
    ReactiveFormsModule
  ]
})
export class DatasetsModule { }
