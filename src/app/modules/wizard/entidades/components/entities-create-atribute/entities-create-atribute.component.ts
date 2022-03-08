import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-entities-create-atribute',
  templateUrl: './entities-create-atribute.component.html',
  styleUrls: ['./entities-create-atribute.component.scss']
})
export class EntitiesCreateAtributeComponent implements OnInit {
  @Output()
  public onSubmit = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  onSendForm(state: string) {
    switch (state) {
      case 'submit':
        this.onSubmit.emit(false);
        break;
      case 'cancel':
        this.onSubmit.emit(false);
        break;
    }
  }
}
