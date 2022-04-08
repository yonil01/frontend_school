import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '',redirectTo: 'user'},
  {path: 'user',loadChildren: () => import('@app/modules/administration/modules/users/users.module').then(m => m.UsersModule )},
  {path: 'message',loadChildren: () => import('@app/modules/administration/modules/messages/messages.module').then(m => m.MessagesModule )},
  {path: 'password-not-allowed',loadChildren: () => import('@app/modules/administration/modules/passwords-not-allowed/passwords-not-allowed.module').then(m => m.PasswordsNotAllowedModule )},
  {path: 'datasets',loadChildren: () => import('@app/modules/administration/modules/datasets/datasets.module').then(m => m.DatasetsModule )},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
