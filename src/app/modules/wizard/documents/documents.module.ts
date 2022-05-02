import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DocumentsRoutingModule} from './documents-routing.module';
import {DocumentsComponent} from './documents.component';
import {UiModule} from "@app/ui/ui.module";
import {PipesModule} from "@app/core/pipes/pipes.module";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DropdownModule, ToastModule} from "ecapture-ng-ui";
import {DocEntityComponent} from "@app/modules/wizard/documents/components/doc-entity/doc-entity.component";
import {AutonameComponent} from "@app/modules/wizard/documents/components/autoname/autoname.component";
import {MatIconModule} from "@angular/material/icon";
import {AnnexesDocComponent} from './pages/annexes-doc/annexes-doc.component';
import {
  ConfigAttributeRequeridComponent
} from './components/config-attribute-requerid/config-attribute-requerid.component';


@NgModule({
  declarations: [
    DocumentsComponent,
    DocEntityComponent,
    AutonameComponent,
    AnnexesDocComponent,
    ConfigAttributeRequeridComponent
  ],
  imports: [
    CommonModule,
    DocumentsRoutingModule,
    UiModule,
    PipesModule,
    TranslateModule,
    ReactiveFormsModule,
    ToastModule,
    DropdownModule,
    FormsModule,
    MatIconModule
  ]
})
export class DocumentsModule {
}
