import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';
import { AutogestionComponent } from './pages/autogestion/autogestion.component';
import { ChangepwdComponent } from './pages/changepwd/changepwd.component';
import { RecoverypwdComponent } from './pages/recoverypwd/recoverypwd.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'autogestion', component: AutogestionComponent },
  { path: 'changepwd', component: ChangepwdComponent },
  { path: 'recoverypwd', component: RecoverypwdComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRoutingModule {}
