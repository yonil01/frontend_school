import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WizardComponent} from "@app/modules/wizard/wizard.component";

const routes: Routes = [
  {
    path: '',
    component: WizardComponent
  },
  {
    path: 'entities',
    loadChildren: () => import('./entidades/entidades.module').then(m => m.EntidadesModule)
  },
  {
    path: 'documents',
    loadChildren: () => import('./documents/documents.module').then(m => m.DocumentsModule)
  },
  /*{
    path: 'dynamic-forms',
    loadChildren: () => import('./dynamic-forms/dynamic-forms.module').then(m => m.DynamicFormsModule)
  },*/
  {
    path: 'bpmn',
    loadChildren: () => import('./process/process.module').then(m => m.ProcessModule)
  },
  {
    path: 'roles',
    loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WizardRoutingModule {
}
