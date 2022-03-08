import {Component, OnInit} from '@angular/core';
import {LocalStorageService} from "@app/core/services/local-storage/local-storage.service";
import {ReturnData} from "@app/modules/wizard/entidades/models/entities.models";

@Component({
  selector: 'app-entidades',
  templateUrl: './entidades.component.html',
  styleUrls: ['./entidades.component.scss']
})
export class EntidadesComponent implements OnInit {

  processes: any = [];
  activeEmptyMsg = true;

  isBlock = false;

  nameClient: string = '';
  nameProject: string = '';
  public showCreateEdit: boolean = false;
  public showEntities: boolean = true;
  public showEntitiesList: boolean = false;

  constructor(private _localStorage: LocalStorageService) {
    this.nameClient = this._localStorage.getClient();
    this.nameProject = this._localStorage.getProject();
  }

  ngOnInit(): void {
  }

  public findProcess(evt: any) {

  }

  public selectedProcessItem(evt: any) {
  }

  createEntity() {
    this.showCreateEdit = true;
    this.showEntities = false;
  }

  onCancelCreateEntities() {
    this.showCreateEdit = false;
    this.showEntities = true;
  }

  onShowEntitiesList() {
    this.showEntities = false;
    this.showEntitiesList = true;
  }

  onShowHome($event: ReturnData) {
    this.showEntities = $event.value;
    switch ($event.id) {
      case 'create':
        this.showCreateEdit = false;
        break;
      case 'list':
        this.showEntitiesList = false;
        break;
    }
  }
}
