import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentsRoutingModule } from './documents-routing.module';
import { DocumentsComponent } from './documents.component';
import {UiModule} from "@app/ui/ui.module";
import {PipesModule} from "@app/core/pipes/pipes.module";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {DropdownModule, ToastModule} from "ecapture-ng-ui";


@NgModule({
  declarations: [
    DocumentsComponent
  ],
    imports: [
        CommonModule,
        DocumentsRoutingModule,
        UiModule,
        PipesModule,
        TranslateModule,
        ReactiveFormsModule,
        ToastModule,
        DropdownModule
    ]
})
export class DocumentsModule { }
