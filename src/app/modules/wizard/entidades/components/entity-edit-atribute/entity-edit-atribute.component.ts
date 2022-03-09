import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Attribute} from "@app/core/models";

@Component({
  selector: 'app-entity-edit-atribute',
  templateUrl: './entity-edit-atribute.component.html',
  styleUrls: ['./entity-edit-atribute.component.scss']
})
export class EntityEditAtributeComponent implements OnInit {
  @Output()
  public onSubmit = new EventEmitter();
  @Input()
  public atribute!: Attribute;
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
