import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProcessListComponent} from "@app/modules/wizard/process/process/Pages/process-list/process-list.component";
import {ProcessCreateComponent} from "@app/modules/wizard/process/process/Pages/process-create/process-create.component";

const routes: Routes = [
  {
    path: '',
    component: ProcessListComponent,
  },
  {
    path: 'create',
    component: ProcessCreateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessRoutingModule { }
