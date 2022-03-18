import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {WizardRoutingModule} from './wizard-routing.module';
import {WizardComponent} from './wizard.component';
import {UiModule} from "@app/ui/ui.module";
import {DropdownModule} from "ecapture-ng-ui";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {RoleService} from "@app/core/services/graphql/auth/role/role.service";
import {DocumentService} from "@app/core/services/graphql/doc/document/document.service";


@NgModule({
  declarations: [
    WizardComponent
  ],
  imports: [
    CommonModule,
    WizardRoutingModule,
    UiModule,
    DropdownModule,
    DragDropModule
  ], providers: [RoleService, DocumentService]
})
export class WizardModule {
}
