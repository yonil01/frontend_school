import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentsRoutingModule } from './documents-routing.module';
import { DocumentsComponent } from './documents.component';
import {UiModule} from "@app/ui/ui.module";


@NgModule({
  declarations: [
    DocumentsComponent
  ],
    imports: [
        CommonModule,
        DocumentsRoutingModule,
        UiModule
    ]
})
export class DocumentsModule { }
