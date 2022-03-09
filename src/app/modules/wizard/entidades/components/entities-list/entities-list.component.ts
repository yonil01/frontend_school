import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LocalStorageService} from "@app/core/services/local-storage/local-storage.service";
import {ReturnData} from "@app/modules/wizard/entidades/models/entities.models";
import {Attribute, Entity} from "@app/core/models";

@Component({
  selector: 'app-entities-list-atributes',
  templateUrl: './entities-list.component.html',
  styleUrls: ['./entities-list.component.scss']
})
export class EntitiesListComponent implements OnInit {
  public nameClient: string = '';
  public nameProject: string = '';
  @Input()
  public selectedEntity!: Entity;
  @Output()
  public isReturn: EventEmitter<ReturnData> = new EventEmitter<ReturnData>();
  public onSelectAutofills: boolean = false;
  public showAtributtes: boolean = true;
  public onSelectCreateAtribute: boolean = false;
  public selectedAttribute!: Attribute;
  public onShowEditAttribute: boolean = false;

  constructor(private _localStorage: LocalStorageService) {
    this.nameClient = this._localStorage.getClient();
    this.nameProject = this._localStorage.getProject();
  }

  ngOnInit(): void {
    console.log(this.selectedEntity);
  }

  onReturn() {
    this.isReturn.emit({
      id: 'list',
      from: 'list',
      value: true
    });
  }

  onShowAutofills() {
    this.onSelectAutofills = true;
    this.showAtributtes = false;
  }

  onShowCascadings() {

  }

  onChangeOption($event: ReturnData) {
    switch ($event.id) {
      case 'autofills':
        this.onSelectAutofills = $event.value;
        break;
      case 'cascadings':
        break;
      case 'atribute':
        this.showAtributtes = $event.value;
        break;
    }
    switch ($event.from) {
      case 'autofills':
        this.onSelectAutofills = false;
        break;
      case 'cascadings':
        break;
      case 'atribute':
        this.showAtributtes = false;
        break;
    }
  }

  onCreateAtribute() {
    this.onSelectCreateAtribute = true;
    this.showAtributtes = false;
  }

  returnCreateAtribute($event: boolean) {
    this.onSelectCreateAtribute = $event;
    this.showAtributtes = true;
  }

  onEditAttribute(i: number) {
    if (this.selectedEntity.attributes) {
      this.onShowEditAttribute = true;
      this.showAtributtes = false;
      if (this.selectedEntity.attributes[i]) {
        this.selectedAttribute = this.selectedEntity.attributes[i];
      }
    } else {
      console.log("No hay atributos");
    }
  }
}
