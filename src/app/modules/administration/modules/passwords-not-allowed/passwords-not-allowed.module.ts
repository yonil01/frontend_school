import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PasswordsNotAllowedRoutingModule } from './passwords-not-allowed-routing.module';
import { PasswordsNotAllowedComponent } from './passwords-not-allowed.component';
import { PasswordsNotAllowedListComponent } from './pages/passwords-not-allowed-list/passwords-not-allowed-list.component';
import { PasswordsNotAllowedCrudComponent } from './pages/passwords-not-allowed-crud/passwords-not-allowed-crud.component';


@NgModule({
  declarations: [
    PasswordsNotAllowedComponent,
    PasswordsNotAllowedListComponent,
    PasswordsNotAllowedCrudComponent
  ],
  imports: [
    CommonModule,
    PasswordsNotAllowedRoutingModule
  ]
})
export class PasswordsNotAllowedModule { }
