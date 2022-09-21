import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {GradoRoutingModule} from './grado-routing.module';
import {GradoComponent} from './grado.component';
import {ComponentsModule} from '@app/core/components/components.module';

import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {AngularSplitModule} from 'angular-split';
import {DropdownModule, FilterService} from "ecapture-ng-ui";
import {PipesModule} from "@app/core/pipes/pipes.module";
import {TranslateModule} from "@ngx-translate/core";
import {
  FilterDocumentsComponent
} from "@app/modules/administration/modules/grado/component/filter-documents/filter-documents.component";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {
  GradoTableComponent
} from "@app/modules/administration/modules/grado/component/grado-table/grado-table.component";
import {PieComponent} from "@app/modules/administration/modules/grado/widgets/pie/pie.component";
import {CardComponent} from "@app/modules/administration/modules/grado/widgets/card/card.component";
import {AreaComponent} from "@app/modules/administration/modules/grado/widgets/area/area.component";
import {HighchartsChartModule} from "highcharts-angular";
import {MatIconModule} from "@angular/material/icon";
import {UiModule} from "@app/ui/ui.module";

@NgModule({
  declarations: [GradoComponent, FilterDocumentsComponent, GradoTableComponent, PieComponent, CardComponent, AreaComponent],
  imports: [
    CommonModule,
    GradoRoutingModule,
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
    UiModule,
  ],
  providers: [FilterService]
})
export class GradoModule {
}
