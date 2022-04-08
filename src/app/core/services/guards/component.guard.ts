import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LocalStorageService } from '@app/core/services/local-storage/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ComponentGuard implements CanActivate {
  constructor(private _router: Router, private _localStorageService: LocalStorageService) {
  }

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const modules = this._localStorageService.getModules();
    let components = modules.map((item:any) => item.components);
    components = components.filter((c) => c);
    const component = components.some((item) => {
      return item.some((com:any) => com.url_front === state.url);
    });
    if (component) {
      return true;
    } else {
      await this._router.navigateByUrl('');
      return false;
    }
  }
}
