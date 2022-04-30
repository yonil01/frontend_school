import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProcessRoutingModule} from './process-routing.module';
import {ProcessComponent} from './process/process.component';
import {ProcessListComponent} from './process/Pages/process-list/process-list.component';
import {UiModule} from "@app/ui/ui.module";
import {ProcessCreateComponent} from './process/Pages/process-create/process-create.component';
import {ProcessShowComponent} from './process/Pages/process-show/process-show.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  CheckboxModule,
  DropdownModule,
  IconsModule,
  InputDateModule,
  InputTextModule,
  ToastModule
} from "ecapture-ng-ui";
import {MatMenuModule} from "@angular/material/menu";
import {ConfigComponent} from "@app/modules/wizard/process/process/components/config/config.component";
import {TranslateModule} from "@ngx-translate/core";
import {TaskFormComponent} from "@app/modules/wizard/process/process/components/task-form/task-form.component";
import {ActivitiesComponent} from "@app/modules/wizard/process/process/components/activities/activities.component";
import {ButtonModule} from "primeng/button";
import {TreeSelectModule} from "primeng/treeselect";
import {ContextMenuModule} from "primeng/contextmenu";
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {
  ActivityFormComponent
} from "@app/modules/wizard/process/process/components/activity-form/activity-form.component";
import {CardModule} from "primeng/card";
import {PipesModule} from "@app/core/pipes/pipes.module";
import {NgCircleProgressModule} from "ng-circle-progress";


@NgModule({
  declarations: [
    ProcessComponent,
    ProcessListComponent,
    ProcessCreateComponent,
    ProcessShowComponent,
    ConfigComponent,
    TaskFormComponent,
    ActivitiesComponent,
    ActivityFormComponent
  ],
    imports: [
        CommonModule,
        ProcessRoutingModule,
        UiModule,
        ReactiveFormsModule,
        FormsModule,
        IconsModule,
        ToastModule,
        MatMenuModule,
        TranslateModule,
        DropdownModule,
        CheckboxModule,
        ButtonModule,
        TreeSelectModule,
        ContextMenuModule,
        ToastModule,
        PerfectScrollbarModule,
        ToastModule,
        ConfirmDialogModule,
        CardModule,
        InputTextModule,
        InputDateModule,
        PipesModule,
      NgCircleProgressModule.forRoot({
        radius: 100,
        outerStrokeWidth: 16,
        innerStrokeWidth: 8,
        outerStrokeColor: "#78C000",
        innerStrokeColor: "#C7E596",
        animationDuration: 300,
        clockwise:true,
      }),
    ]
})
export class ProcessModule {
}
