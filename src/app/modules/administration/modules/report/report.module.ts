import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {ReportRoutingModule} from './report-routing.module';
import {ReportComponent} from './report.component';
import {ComponentsModule} from '@app/core/components/components.module';

import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {AngularSplitModule} from 'angular-split';
import {UiModule} from "@app/core/ui/ui.module";
import {DropdownModule, FilterService} from "ecapture-ng-ui";
import {PipesModule} from "@app/core/pipes/pipes.module";
import {TranslateModule} from "@ngx-translate/core";
import {
  FilterDocumentsComponent
} from "@app/modules/administration/modules/report/component/filter-documents/filter-documents.component";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {
  ReportTableComponent
} from "@app/modules/administration/modules/report/component/report-table/report-table.component";
import {PieComponent} from "@app/modules/administration/modules/report/widgets/pie/pie.component";
import {CardComponent} from "@app/modules/administration/modules/report/widgets/card/card.component";
import {AreaComponent} from "@app/modules/administration/modules/report/widgets/area/area.component";
import {HighchartsChartModule} from "highcharts-angular";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
  declarations: [ReportComponent, FilterDocumentsComponent, ReportTableComponent, PieComponent, CardComponent, AreaComponent],
  imports: [
    CommonModule,
    ReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    AngularSplitModule,
    ComponentsModule,
    UiModule,
    DropdownModule,
    PipesModule,
    TranslateModule,
    MatInputModule,
    MatDatepickerModule,
    HighchartsChartModule,
    MatIconModule,
  ],
  providers: [FilterService]
})
export class ReportModule {
}
