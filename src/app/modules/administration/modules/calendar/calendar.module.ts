import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {ReactiveFormsModule} from "@angular/forms";
import {CalendarComponent} from "@app/modules/administration/modules/calendar/calendar.component";
import {CalendarRoutingModule} from "@app/modules/administration/modules/calendar/calendar-routing.module";
import {UiModule} from "@app/ui/ui.module";
import { CreateCalendarComponent } from './pages/create-calendar/create-calendar.component';
import {DropdownModule, InputTextModule, ToastModule} from "ecapture-ng-ui";
import {TranslateModule} from "@ngx-translate/core";
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatNativeDateModule} from "@angular/material/core";
import { SettingCalendarComponent } from './pages/setting-calendar/setting-calendar.component';
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
//  primeng module


@NgModule({
  declarations: [
    CalendarComponent,
    CreateCalendarComponent,
    SettingCalendarComponent,
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CalendarRoutingModule,
    UiModule,
    InputTextModule,
    TranslateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    ToastModule,
    DropdownModule,
    NgxMaterialTimepickerModule,

  ],
  providers: []
})
export class CalendarModule { }
