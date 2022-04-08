import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {
  @Output()
  public stateEvent = new EventEmitter<boolean>();


  constructor() {
  }

  ngOnInit(): void {
  }

  onDelete() {
    this.stateEvent.emit(true);
  }

  onCancel() {
    this.stateEvent.emit(false);
  }
}
