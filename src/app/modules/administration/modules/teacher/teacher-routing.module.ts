import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TeacherListComponent} from "@app/modules/administration/modules/teacher/pages/teacher-list/teacher-list.component";
import {TeacherComponent} from "@app/modules/administration/modules/teacher/teacher.component";

const routes: Routes = [
  {path: ':id', component: TeacherComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
