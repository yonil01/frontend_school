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

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule {
}
