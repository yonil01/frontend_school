import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ClassroomComponent} from "@app/modules/administration/modules/classroom/classroom.component";

const routes: Routes = [
  {path: ':id', component: ClassroomComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassroomRoutingModule { }
