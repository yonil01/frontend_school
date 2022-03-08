import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LocalStorageService} from "@app/core/services/local-storage/local-storage.service";
import {ReturnData} from "@app/modules/wizard/entidades/models/entities.models";

@Component({
  selector: 'app-entities-create-edit',
  templateUrl: './entities-create-edit.component.html',
  styleUrls: ['./entities-create-edit.component.scss']
})
export class EntitiesCreateEditComponent implements OnInit {
  @Output()
  public isReturn: EventEmitter<ReturnData> = new EventEmitter();

  constructor() {

  }

  ngOnInit(): void {
  }

  onCancelCreateEntities() {

  }

  onReturn() {
  this.isReturn.emit({
    id: 'create',
    from: 'create',
    value: true
  });
  }
}
