import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ComponentGuard} from "@app/core/services/guards/component.guard";

const routes: Routes = [
  {path: '', redirectTo: 'user'},
  {
    path: 'user',
    loadChildren: () => import('@app/modules/administration/modules/users/users.module').then(m => m.UsersModule),
    canActivate: [ComponentGuard],
  },
  {
    path: 'message',
    loadChildren: () => import('@app/modules/administration/modules/messages/messages.module').then(m => m.MessagesModule),
    canActivate: [ComponentGuard],
  },
  {
    path: 'password-not-allowed',
    loadChildren: () => import('@app/modules/administration/modules/passwords-not-allowed/passwords-not-allowed.module').then(m => m.PasswordsNotAllowedModule),
    canActivate: [ComponentGuard],
  },
  {
    path: 'datasets',
    loadChildren: () => import('@app/modules/administration/modules/datasets/datasets.module').then(m => m.DatasetsModule),
    canActivate: [ComponentGuard],
  },
  {
    path: 'calendar',
    loadChildren: () => import('@app/modules/administration/modules/calendar/calendar.module').then(m => m.CalendarModule),
    canActivate: [ComponentGuard],
  },
  {
    path: 'notification',
    loadChildren: () => import('@app/modules/administration/modules/notification/notification.module').then(m => m.NotificationModule),
    canActivate: [ComponentGuard],
  },
  {
    path: 'timer',
    loadChildren: () => import('@app/modules/administration/modules/timer/timer.module').then(m => m.TimerModule),
    canActivate: [ComponentGuard],
  },
  {
    path: 'console_notification',
    loadChildren: () => import('@app/modules/administration/modules/console-notify/console-notify.module').then(m => m.ConsoleNotifyModule),
    canActivate: [ComponentGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule {
}
