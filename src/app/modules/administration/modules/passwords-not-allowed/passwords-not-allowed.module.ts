import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PasswordsNotAllowedRoutingModule } from './passwords-not-allowed-routing.module';
import { PasswordsNotAllowedComponent } from './passwords-not-allowed.component';
import { PasswordsNotAllowedListComponent } from './pages/passwords-not-allowed-list/passwords-not-allowed-list.component';
import { PasswordsNotAllowedCrudComponent } from './pages/passwords-not-allowed-crud/passwords-not-allowed-crud.component';
import {
  PasswordNotAllowedService
} from "@app/modules/administration/modules/passwords-not-allowed/services/password-not-allowed.service";
import {HttpClientModule} from "@angular/common/http";
import {UiModule} from "@app/ui/ui.module";
import {ToastModule} from "ecapture-ng-ui";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  declarations: [
    PasswordsNotAllowedComponent,
    PasswordsNotAllowedListComponent,
    PasswordsNotAllowedCrudComponent
  ],
    imports: [
        CommonModule,
        PasswordsNotAllowedRoutingModule,
        HttpClientModule,
        UiModule,
        ToastModule,
        ReactiveFormsModule,
        TranslateModule
    ],
  providers:[PasswordNotAllowedService]

})
export class PasswordsNotAllowedModule { }
