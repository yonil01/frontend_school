import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BlockPageComponent} from "@app/ui/components/block-page/block-page.component";
import {SidebarComponent} from "@app/ui/components/sidebar/sidebar.component";
import {LayoutComponent} from "@app/ui/components/layout/layout.component";
import {HeaderComponent} from "@app/ui/components/header/header.component";
import {FooterComponent} from "@app/ui/components/footer/footer.component";



@NgModule({
    declarations: [
        FooterComponent,
        HeaderComponent,
        LayoutComponent,
        SidebarComponent,
        BlockPageComponent
    ],
  exports: [
    FooterComponent,
    BlockPageComponent
  ],
    imports: [
        CommonModule
    ]
})
export class UiModule { }
