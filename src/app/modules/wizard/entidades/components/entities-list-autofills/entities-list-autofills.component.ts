import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ReturnData} from "@app/modules/wizard/entidades/models/entities.models";
import {LocalStorageService} from "@app/core/services/local-storage/local-storage.service";

@Component({
  selector: 'app-entities-list-autofills',
  templateUrl: './entities-list-autofills.component.html',
  styleUrls: ['./entities-list-autofills.component.scss']
})
export class EntitiesListAutofillsComponent implements OnInit {
  public nameClient: string = '';
  public nameProject: string = '';
  @Output()
  public isAtribute: EventEmitter<ReturnData> = new EventEmitter<ReturnData>();

  constructor(private _localStorage: LocalStorageService) {
    this.nameClient = this._localStorage.getClient();
    this.nameProject = this._localStorage.getProject();
  }

  ngOnInit(): void {
  }

  onClickAtributes() {
    this.isAtribute.emit({
      id: 'atribute',
      from: 'autofills',
      value: true,
    });
  }
}
