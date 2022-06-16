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
    const modules:any[] = this._localStorageService.getModules();
    let elements:any[] = [];

    for(let module of modules){
      for(let component of module.components){
        for(let element of component.elements){
          elements.push(element);
        }
      }
    }

    let element: any = null;
    for(let item of elements){
      if(state.url === item.url_back){
        element = item;
        break;
      }
    }

    if (element) {
      return true;
    } else {
      await this._router.navigateByUrl('');
      return false;
    }
  }
}
