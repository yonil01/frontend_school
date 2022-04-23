import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhiteListComponent } from './white-list.component';
import { WhiteListPageComponent } from './pages/white-list-page/white-list-page.component';
import {UiModule} from "@app/ui/ui.module";
import {ToastModule} from "ecapture-ng-ui";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    WhiteListComponent,
    WhiteListPageComponent
  ],
  imports: [
    CommonModule,
    UiModule,
    ToastModule,
    ReactiveFormsModule
  ]
})
export class WhiteListModule { }
