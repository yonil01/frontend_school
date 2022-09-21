import {EventEmitter} from "@angular/core";

export interface Confirmation {
  position?: string;
  key?: string;
  message?: string;
  type?: string;
  header?: string;
  accept?: Function;
  reject?: Function;
  closeOnEscape?: boolean;
  defaultFocus?: string;
  acceptButtonStyleClass?: string;
  rejectButtonStyleClass?: string;
  target?: EventTarget;
  acceptEvent?: EventEmitter<any>;
  rejectEvent?: EventEmitter<any>;
}
