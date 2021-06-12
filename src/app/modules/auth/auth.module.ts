import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './pages/login/login.component';
import { RecoveryComponent } from './pages/recovery/recovery.component';
import { ModalModule} from "ecapture-ng-ui";


@NgModule({
  declarations: [

    AuthComponent,
       LoginComponent,
       RecoveryComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ModalModule
  ]
})
export class AuthModule { }
