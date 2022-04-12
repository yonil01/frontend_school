import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProcessListComponent} from "@app/modules/wizard/process/process/Pages/process-list/process-list.component";
import {
  ProcessCreateComponent
} from "@app/modules/wizard/process/process/Pages/process-create/process-create.component";
import {ProcessShowComponent} from "@app/modules/wizard/process/process/Pages/process-show/process-show.component";

const routes: Routes = [
  {
    path: '',
    component: ProcessListComponent,
  },
  {
    path: 'show',
    component: ProcessShowComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessRoutingModule {
}
