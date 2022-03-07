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
    ButtonComponent
  ],
    exports: [
        FooterComponent,
        BlockPageComponent,
        LayoutComponent,
        TableComponent,
      IconDirective
    ],
  imports: [
    CommonModule
  ],
  providers: [MenuService, LocalStorageService]
})
export class UiModule {
}
