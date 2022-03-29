import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhiteListComponent } from './white-list.component';
import { WhiteListPageComponent } from './pages/white-list-page/white-list-page.component';



@NgModule({
  declarations: [
    WhiteListComponent,
    WhiteListPageComponent
  ],
  imports: [
    CommonModule
  ]
})
export class WhiteListModule { }
