import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '@app/core/services/local-storage/local-storage.service';
import {ModalService} from "@app/core/services/modal/modal.service";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private _localSorageService: LocalStorageService,
    private _router: Router,
    private _modalService: ModalService,
  ) {}

  canActivate() {
    if (sessionStorage.getItem('Token')) {
      return true;
    } else {
      this._router.navigateByUrl('');
      return false;
    }
  }

  validateSessionExp() {
    if (sessionStorage.getItem('Token')) {
      const timeout = this._localSorageService.getSessionExp();
      const current = new Date().getTime() / 1000;

      if (timeout < current) {
        // sessionStorage.clear()
        this._modalService.open();
        return false;
      }
      return true;
    }
    return false;
  }
}
