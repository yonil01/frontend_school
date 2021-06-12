import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "@app/modules/auth/pages/login/login.component";

const routes: Routes = [
  {path: '',redirectTo: 'login'},
  {path: 'login', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
