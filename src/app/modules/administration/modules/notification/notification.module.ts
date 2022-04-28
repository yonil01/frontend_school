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
import {NotificationComponent} from "@app/modules/administration/modules/notification/notification.component";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import { CreateNotificationComponent } from './pages/create-notification/create-notification.component';




@NgModule({
  declarations: [
    NotificationComponent,
    CreateNotificationComponent,
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NotificationRoutingModule,
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
export class NotificationModule { }
