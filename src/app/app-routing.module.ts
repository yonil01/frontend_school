import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {QuicklinkModule, QuicklinkStrategy} from "ngx-quicklink";
import {AuthenticationGuard} from "@app/core/services/guards/authentication.guard";
import {ComponentGuard} from "@app/core/services/guards/component.guard";

const routes: Routes = [
  {path: '', redirectTo: 'auth', pathMatch: 'full'},
  {path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule)},
  {
    path: 'wizard',
    canActivate: [AuthenticationGuard, ComponentGuard],
    loadChildren: () => import('./modules/wizard/wizard.module').then((m) => m.WizardModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/administration/administration.module').then((m) => m.AdministrationModule)
  }
];

@NgModule({
  imports: [QuicklinkModule, RouterModule.forRoot(routes,
    {
      useHash: true,
      preloadingStrategy: QuicklinkStrategy,
      paramsInheritanceStrategy: "always",
      scrollPositionRestoration: "enabled"
    })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
