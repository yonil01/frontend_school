import {Injectable} from '@angular/core';
import {Subject} from "rxjs/internal/Subject";
import {Confirmation} from "@app/core/ui/confirm-dialog/model";

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  private requireConfirmationSource = new Subject<Confirmation>();
  private acceptConfirmationSource = new Subject<Confirmation>();

  public requireConfirmation$ = this.requireConfirmationSource.asObservable();
  public accept = this.acceptConfirmationSource.asObservable();

  public confirm(confirmation: Confirmation): any {
    if (confirmation) {
      this.requireConfirmationSource.next(confirmation);
    }
    return this;
  }

  public close(): any {
    this.requireConfirmationSource.next({});
    return this;
  }

  public onAccept(): void {
    this.acceptConfirmationSource.next({});
  }
}
