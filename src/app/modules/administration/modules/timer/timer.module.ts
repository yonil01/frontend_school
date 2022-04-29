import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {ReactiveFormsModule} from "@angular/forms";
import {UiModule} from "@app/ui/ui.module";
import {InputTextModule, ToastModule} from "ecapture-ng-ui";
import {TranslateModule} from "@ngx-translate/core";
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatNativeDateModule} from "@angular/material/core";
import {NotificationRoutingModule} from "@app/modules/administration/modules/notification/notification-routing.module";
import {TimerComponent} from "@app/modules/administration/modules/timer/timer.component";
import {TimerRoutingModule} from "@app/modules/administration/modules/timer/timer-routing.module";
import { CreateTimerComponent } from './pages/create-timer/create-timer.component';




@NgModule({
  declarations: [
    TimerComponent,
    CreateTimerComponent
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TimerRoutingModule,
    UiModule,
    InputTextModule,
    TranslateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    ToastModule,

  ],
  providers: []
})
export class TimerModule { }
