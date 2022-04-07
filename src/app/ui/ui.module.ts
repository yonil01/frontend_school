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
import { TableComponent } from './components/table/table.component';
import {IconDirective} from "@app/ui/directivas/icon.directive";
import { ButtonComponent } from './components/button/button.component';
import {RouterModule} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {DropdownModule, InputTextModule} from "ecapture-ng-ui";
import { StepComponent } from './components/step/step.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import {TableStandarComponent} from "@app/ui/components/table/components/table-standar/table-standar.component";

import { PaginationComponent } from './components/table/components/pagination/pagination.component';
import {Ng2SearchPipeModule} from "ng2-search-filter";
import {FormsModule} from "@angular/forms";


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
    ],
    exports: [
        FooterComponent,
        BlockPageComponent,
        LayoutComponent,
        TableComponent,
        IconDirective,
        ButtonComponent,
        StepComponent,
    ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    InputTextModule,
    DropdownModule,
    NgCircleProgressModule.forRoot({
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    }),
    Ng2SearchPipeModule,
    FormsModule

  ],
  providers: [MenuService, LocalStorageService]
})
export class UiModule {
}
