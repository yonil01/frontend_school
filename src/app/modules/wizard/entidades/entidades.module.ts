import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EntidadesRoutingModule} from './entidades-routing.module';
import {EntidadesComponent} from './entidades.component';
import {UiModule} from "@app/ui/ui.module";
import { EntitiesListComponent } from './components/entities-list/entities-list.component';
import { EntitiesCreateEditComponent } from './components/entities-create-edit/entities-create-edit.component';
import { EntitiesListAutofillsComponent } from './components/entities-list-autofills/entities-list-autofills.component';
import { EntitiesCreateAtributeComponent } from './components/entities-create-atribute/entities-create-atribute.component';


@NgModule({
  declarations: [
    EntidadesComponent,
    EntitiesListComponent,
    EntitiesCreateEditComponent,
    EntitiesListAutofillsComponent,
    EntitiesCreateAtributeComponent,
  ],
  imports: [
    CommonModule,
    EntidadesRoutingModule,
    UiModule
  ]
})
export class EntidadesModule {
}
