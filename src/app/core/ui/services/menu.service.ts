import { Injectable, Output, EventEmitter, OnInit } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable()
export class MenuService {
  private subject = new Subject<any>();

  @Output() change: EventEmitter<boolean> = new EventEmitter();

  open() {
    this.subject.next({ isOpen: true });
  }

  close() {
    this.subject.next({ isOpen: false });
  }

  getMenu(): Subject<any> {
    return this.subject;
  }
}
