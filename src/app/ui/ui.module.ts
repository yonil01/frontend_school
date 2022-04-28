import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BlockPageComponent} from "@app/ui/components/block-page/block-page.component";
import {SidebarComponent} from "@app/ui/components/sidebar/sidebar.component";
import {LayoutComponent} from "@app/ui/components/layout/layout.component";
import {HeaderComponent} from "@app/ui/components/header/header.component";
import {FooterComponent} from "@app/ui/components/footer/footer.component";
import {MenuComponent} from "@app/ui/components/menu/menu.component";
import {MenuService} from "@app/ui/services/menu.service";
import {LocalStorageService} from "@app/core/services/local-storage/local-storage.service";
import {PickTaskComponent} from './components/pick-task/pick-task.component';
import {DragDropModule} from "@angular/cdk/drag-drop";
import {FilterService} from "@app/ui/services/filter.service";
import {ConfirmDialogComponent} from "@app/ui/components/confirm-dialog/confirm-dialog.component";
import {SideTaskComponent} from './components/side-task/side-task.component';
import {PaginatorComponent} from './components/paginator/paginator.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {EcTooltipDirective} from './directives/ec-tooltip.directive';
import {TableComponent} from "@app/ui/components/table/table.component";
import {IconDirective} from "@app/ui/directivas/icon.directive";
import {ButtonComponent} from "@app/ui/components/button/button.component";
import {TableStandarComponent} from "@app/ui/components/table/components/table-standar/table-standar.component";
import {StepComponent} from "@app/ui/components/step/step.component";
import {PaginationComponent} from "@app/ui/components/table/components/pagination/pagination.component";
import {NgCircleProgressModule} from "ng-circle-progress";
import {Ng2SearchPipeModule} from "ng2-search-filter";
import { ListSelectComponent } from './components/list-select/list-select.component';
import {DropdownModule} from "ecapture-ng-ui";
import {TranslateModule} from "@ngx-translate/core";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatNativeDateModule} from "@angular/material/core";

@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    LayoutComponent,
    SidebarComponent,
    BlockPageComponent,
    MenuComponent,
    TableComponent,
    IconDirective,
    ButtonComponent,
    StepComponent,
    TableStandarComponent,
    TableStandarComponent,
    PaginationComponent,
    PickTaskComponent,
    ConfirmDialogComponent,
    SideTaskComponent,
    PaginatorComponent,
    EcTooltipDirective,
    FooterComponent,
    HeaderComponent,
    LayoutComponent,
    SidebarComponent,
    BlockPageComponent,
    MenuComponent,
    PickTaskComponent,
    ConfirmDialogComponent,
    SideTaskComponent,
    PaginatorComponent,
    EcTooltipDirective,
    ListSelectComponent
  ],
    exports: [
        FooterComponent,
        BlockPageComponent,
        LayoutComponent,
        PickTaskComponent,
        ConfirmDialogComponent,
        SideTaskComponent,
        PaginatorComponent,
        EcTooltipDirective,
        TableComponent,
        ButtonComponent,
        ButtonComponent,
        IconDirective,
        StepComponent,
        ListSelectComponent,

    ],
  imports: [
    CommonModule,
    DragDropModule,
    FormsModule,
    NgCircleProgressModule,
    Ng2SearchPipeModule,
    NgCircleProgressModule.forRoot({
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    }),
    DropdownModule,
    TranslateModule,
    NgxMaterialTimepickerModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
  providers: [MenuService, LocalStorageService, FilterService]
})
export class UiModule {
}
