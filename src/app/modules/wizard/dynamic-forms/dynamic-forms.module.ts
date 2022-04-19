import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicFormsRoutingModule } from './dynamic-forms-routing.module';
import { DynamicFormsComponent } from './dynamic-forms.component';
import {UiModule} from "@app/ui/ui.module";
import { FormsComponent } from './components/forms/forms.component';
import { EditComponent } from './components/edit/edit.component';
import {CheckboxModule, DropdownModule, InputTextModule} from "ecapture-ng-ui";
import { CreateContainerComponent } from './components/create-container/create-container.component';
import { ConfigurationComponent } from './container/configuration/configuration.component';
import { GridsterComponent } from './container/gridster/gridster.component';
import { BlockOptionComponent } from './container/block-option/block-option.component';
import { ContainerCardComponent } from './container/container-card/container-card.component';
import {GridsterModule} from "angular-gridster2";
import {RadioButtonModule} from "primeng/radiobutton";
import {CheckboxModule as check} from "primeng/checkbox";
import {StepsModule} from "primeng/steps";
import {ReactiveFormsModule} from "@angular/forms";
import { DynamicFormsListComponent } from './pages/dynamic-forms-list/dynamic-forms-list.component';
import { DynamicFormsDetailComponent } from './pages/dynamic-forms-detail/dynamic-forms-detail.component';
import { DynamicFormsContainerCreateComponent } from './pages/dynamic-forms-container-create/dynamic-forms-container-create.component';
import { DynamicFormsContainerEditComponent } from './pages/dynamic-forms-container-edit/dynamic-forms-container-edit.component';


@NgModule({
  declarations: [
    DynamicFormsComponent,
    FormsComponent,
    EditComponent,
    CreateContainerComponent,
    ConfigurationComponent,
    GridsterComponent,
    BlockOptionComponent,
    ContainerCardComponent,
    DynamicFormsListComponent,
    DynamicFormsDetailComponent,
    DynamicFormsContainerCreateComponent,
    DynamicFormsContainerEditComponent
  ],
  imports: [
    CommonModule,
    DynamicFormsRoutingModule,
    UiModule,
    InputTextModule,
    CheckboxModule,
    DropdownModule,
    GridsterModule,
    RadioButtonModule,
    check,
    StepsModule,
    ReactiveFormsModule
  ]
})
export class DynamicFormsModule { }
