import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageVisorComponent } from './image-visor/image-visor.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { KeyWordEntitiesComponent } from './key-word-entities/key-word-entities.component';
import { KeyWordValuesComponent } from './key-word-values/key-word-values.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DocumentTableComponent } from './document-table/document-table.component';
import { HistorialWorkflowComponent } from './historial-workflow/historial-workflow.component';
import { CommentsDocumentComponent } from './comments-document/comments-document.component';
import { HistorialDocumentComponent } from './historial-document/historial-document.component';
import { KeyWordMultipleValuesComponent } from './key-word-multiple-values/key-word-multiple-values.component';
import { FormExternalComponent } from './form-external/form-external.component';
import { PdfVisorComponent } from './pdf-visor/pdf-visor.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TraceabilityDocumentComponent } from './traceability-document/traceability-document.component';
import { ChangepwduserComponent } from '@app/core/components/changepwduser/changepwduser.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ImportDocumentComponent } from './import-document/import-document.component';
import { ImportFormComponent } from './import-form/import-form.component';

import { PipesModule } from '@app/core/pipes/pipes.module';
import {DropdownModule, IconsModule, InputDateModule, InputTextModule, ToastModule} from "ecapture-ng-ui";
import {UiModule} from "@app/core/ui/ui.module";
import {TranslateModule} from "@ngx-translate/core";
import { KeyWordSimpleEntityComponent } from './key-word-simple-entity/key-word-simple-entity.component';
import { KeyWordMultipleEntityComponent } from './key-word-multiple-entity/key-word-multiple-entity.component';

@NgModule({
    declarations: [
        ImageVisorComponent,
        KeyWordEntitiesComponent,
        DocumentTableComponent,
        KeyWordValuesComponent,
        HistorialWorkflowComponent,
        CommentsDocumentComponent,
        HistorialDocumentComponent,
        KeyWordMultipleValuesComponent,
        FormExternalComponent,
        PdfVisorComponent,
        TraceabilityDocumentComponent,
        ChangepwduserComponent,
        ImportDocumentComponent,
        ImportFormComponent,
        KeyWordSimpleEntityComponent,
        KeyWordMultipleEntityComponent,
        KeyWordMultipleEntityComponent,
    ],
  imports: [
    CommonModule,
    PdfViewerModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    NgxExtendedPdfViewerModule,
    PipesModule,
    DropdownModule,
    UiModule,
    ToastModule,
    TranslateModule,
    InputTextModule,
    InputDateModule,
    IconsModule,
  ],
    exports: [
        ImageVisorComponent,
        KeyWordEntitiesComponent,
        DocumentTableComponent,
        KeyWordValuesComponent,
        HistorialWorkflowComponent,
        CommentsDocumentComponent,
        HistorialDocumentComponent,
        KeyWordMultipleValuesComponent,
        FormExternalComponent,
        TraceabilityDocumentComponent,
        ChangepwduserComponent,
        ImportDocumentComponent,
        ImportFormComponent,
        KeyWordSimpleEntityComponent,
        KeyWordMultipleEntityComponent,
    ],
})
export class ComponentsModule {}
