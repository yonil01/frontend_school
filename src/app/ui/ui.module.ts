import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LayoutComponent } from './components/layout/layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';



@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    LayoutComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule
  ]
})
export class UiModule { }
