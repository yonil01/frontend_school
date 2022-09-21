import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ComponentGuard} from "@app/core/services/guards/component.guard";

const routes: Routes = [
  {path: '', redirectTo: 'user'},
  {
    path: 'students',
    loadChildren: () => import('@app/modules/administration/modules/users/users.module').then(m => m.UsersModule),
    // canActivate: [ComponentGuard],
  },
  {
    path: 'teachers',
    loadChildren: () => import('@app/modules/administration/modules/teacher/teacher.module').then(m => m.TeacherModule),
    // canActivate: [ComponentGuard],
  },
  {
    path: 'staff',
    loadChildren: () => import('@app/modules/administration/modules/personals/personals.module').then(m => m.PersonalsModule),
    // canActivate: [ComponentGuard],
  },
  {
    path: 'subjects',
    loadChildren: () => import('@app/modules/administration/modules/subject/subject.module').then(m => m.SubjectModule),
    // canActivate: [ComponentGuard],
  },
  {
    path: 'classrooms',
    loadChildren: () => import('@app/modules/administration/modules/classroom/classroom.module').then(m => m.ClassroomModule),
    // canActivate: [ComponentGuard],
  },
  {
    path: 'payments',
    loadChildren: () => import('@app/modules/administration/modules/payments/payments.module').then(m => m.PaymentsModule),
    // canActivate: [ComponentGuard],
  },
  {
    path: 'report',
    loadChildren: () => import('@app/modules/administration/modules/report/report.module').then(m => m.ReportModule),
    // canActivate: [ComponentGuard],
  },
  {
    path: 'grados',
    loadChildren: () => import('@app/modules/administration/modules/grado/grado.module').then(m => m.GradoModule),
    // canActivate: [ComponentGuard],
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
