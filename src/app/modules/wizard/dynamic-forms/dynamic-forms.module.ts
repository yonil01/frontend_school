import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicFormsRoutingModule } from './dynamic-forms-routing.module';
import { DynamicFormsComponent } from './dynamic-forms.component';
import {UiModule} from "@app/ui/ui.module";
import { DynamicFormsListComponent } from './pages/dynamic-forms-list/dynamic-forms-list.component';
import { DynamicFormsDetailComponent } from './pages/dynamic-forms-detail/dynamic-forms-detail.component';
import { DynamicFormsContainerCreateComponent } from './pages/dynamic-forms-container-create/dynamic-forms-container-create.component';
import { DynamicFormsContainerEditComponent } from './pages/dynamic-forms-container-edit/dynamic-forms-container-edit.component';


@NgModule({
  declarations: [
    DynamicFormsComponent,
    DynamicFormsListComponent,
    DynamicFormsDetailComponent,
    DynamicFormsContainerCreateComponent,
    DynamicFormsContainerEditComponent
  ],
    imports: [
        CommonModule,
        DynamicFormsRoutingModule,
        UiModule
    ]
})
export class DynamicFormsModule { }
