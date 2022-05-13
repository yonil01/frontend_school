import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EntidadesRoutingModule} from './entidades-routing.module';
import {EntidadesComponent} from './entidades.component';
import {UiModule} from "@app/ui/ui.module";
import { EntitiesListComponent } from './components/entities-list/entities-list.component';
import { EntitiesCreateEditComponent } from './components/entities-create-edit/entities-create-edit.component';
import { EntitiesListAutofillsComponent } from './components/entities-list-autofills/entities-list-autofills.component';
import { EntitiesCreateAtributeComponent } from './components/entities-create-atribute/entities-create-atribute.component';
import {ReactiveFormsModule} from "@angular/forms";
import { EntityAddDatasetComponent } from './components/entity-add-dataset/entity-add-dataset.component';
import {ToastModule, ToastService} from "ecapture-ng-ui";
import { EntitiesCreateEditAutofillsComponent } from './components/entities-create-edit-autofills/entities-create-edit-autofills.component';
import { EntityListCascadeComponent } from './components/entity-list-cascade/entity-list-cascade.component';
import { EntityCreateEditCascadingComponent } from './components/entity-create-edit-cascading/entity-create-edit-cascading.component';
import { EntityAddAttributeComponent } from './components/entity-add-attribute/entity-add-attribute.component';
import {DragDropModule} from "@angular/cdk/drag-drop";
import { EntityListValuesComponent } from './components/entity-list-values/entity-list-values.component';
import { EntityCreateValueComponent } from './components/entity-create-value/entity-create-value.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  declarations: [
    EntidadesComponent,
    EntitiesListComponent,
    EntitiesCreateEditComponent,
    EntitiesListAutofillsComponent,
    EntitiesCreateAtributeComponent,
    EntityAddDatasetComponent,
    EntitiesCreateEditAutofillsComponent,
    EntityListCascadeComponent,
    EntityListCascadeComponent,
    EntityCreateEditCascadingComponent,
    EntityCreateEditCascadingComponent,
    EntityAddAttributeComponent,
    EntityListValuesComponent,
    EntityCreateValueComponent,
    ConfirmationModalComponent,

  ],
    imports: [
        CommonModule,
        EntidadesRoutingModule,
        UiModule,
        ReactiveFormsModule,
        ToastModule,
        DragDropModule,
        TranslateModule
    ],
  providers: [
    ToastService
  ]
})
export class EntidadesModule {
}
