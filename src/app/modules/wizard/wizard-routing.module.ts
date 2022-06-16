import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WizardComponent} from "@app/modules/wizard/wizard.component";
import {ComponentGuard} from "@app/core/services/guards/component.guard";

const routes: Routes = [
  {
    path: '',
    component: WizardComponent
  },
  {
    path: 'entities',
    loadChildren: () => import('./entidades/entidades.module').then(m => m.EntidadesModule),
    canActivate: [ComponentGuard],
  },
  {
    path: 'documents',
    loadChildren: () => import('./documents/documents.module').then(m => m.DocumentsModule),
    canActivate: [ComponentGuard],
  },
  {
    path: 'dynamic-forms',
    loadChildren: () => import('./dynamic-forms/dynamic-forms.module').then(m => m.DynamicFormsModule),
    canActivate: [ComponentGuard],
  },
  {
    path: 'bpmn',
    loadChildren: () => import('./process/process.module').then(m => m.ProcessModule),
    canActivate: [ComponentGuard],
  },
  {
    path: 'roles',
    loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule),
    canActivate: [ComponentGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WizardRoutingModule {
}
