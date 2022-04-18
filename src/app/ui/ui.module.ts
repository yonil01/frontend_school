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
import {FormsModule} from "@angular/forms";
import {EcTooltipDirective} from './directives/ec-tooltip.directive';

@NgModule({
  declarations: [
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
    EcTooltipDirective
  ],
  exports: [
    FooterComponent,
    BlockPageComponent,
    LayoutComponent,
    PickTaskComponent,
    ConfirmDialogComponent,
    SideTaskComponent,
    PaginatorComponent,
    EcTooltipDirective
  ],
  imports: [
    CommonModule,
    DragDropModule,
    FormsModule
  ],
  providers: [MenuService, LocalStorageService, FilterService]
})
export class UiModule {
}
