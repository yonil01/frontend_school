import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AuthRoutingModule} from './auth-routing.module';
import {AuthComponent} from './auth.component';
import {LoginComponent} from './pages/login/login.component';
import {RecoveryComponent} from './pages/recovery/recovery.component';
import {IconsModule, ModalModule, ToastModule} from "ecapture-ng-ui";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {UiModule} from "@app/ui/ui.module";


@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    RecoveryComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ModalModule,
    ToastModule,
    TranslateModule,
    ReactiveFormsModule,
    UiModule,
    IconsModule
  ]
})
export class AuthModule {
}
