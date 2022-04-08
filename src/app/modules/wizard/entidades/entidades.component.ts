import {Component, OnInit} from '@angular/core';
import {LocalStorageService} from "@app/core/services/local-storage/local-storage.service";
import {ReturnData} from "@app/modules/wizard/entidades/models/entities.models";
import {Store} from "@ngrx/store";
import {AppState} from "@app/core/store/app.reducers";
import {EntityService} from "@app/modules/wizard/entidades/services/entities.service";
import {controlEntities} from "@app/core/store/actions/entity.action";
import {Customer, Entity, Project} from "@app/core/models";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {Response} from "@app/core/models";
import {ToastService} from "ecapture-ng-ui";
import {ToastModel, ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";

@Component({
  selector: 'app-entidades',
  templateUrl: './entidades.component.html',
  styleUrls: ['./entidades.component.scss']
})
export class EntidadesComponent implements OnInit {

  public client!: Customer;
  public project!: Project;
  public datasetForm!: FormGroup;
  public dataSets!: FormArray;

  public entities: Entity[] = [];
  public entity!: Entity;
  public toastStyle: ToastStyleModel = toastDataStyle;

  processes: any = [];
  activeEmptyMsg = true;

  isBlock = false;

  nameClient: string = '';
  nameProject: string = '';
  public showCreateEdit: boolean = false;
  public showEntities: boolean = true;
  public showEntitiesList: boolean = false;
  public selectedEntity: any;
  public showEditEntity: boolean = false;
  public isDelete: boolean = false;
  private isShowForm: boolean = true;

  constructor(private _localStorage: LocalStorageService,
              private store: Store<AppState>,
              private formBulder: FormBuilder,
              private entityService: EntityService,
              private messageService: ToastService
  ) {
    this.nameClient = this._localStorage.getClient();
    this.nameProject = this._localStorage.getProject();
  }

  ngOnInit(): void {
    this.isBlock = true;
    if (sessionStorage.getItem('client') && sessionStorage.getItem('project')) {
      // @ts-ignore
      this.client = JSON.parse(sessionStorage.getItem('client'));
      // @ts-ignore
      this.project = JSON.parse(sessionStorage.getItem('project'));
    }
    this.getEntitiesByProject();

    this.store.select('entity').subscribe(({entities, entity, isShowAttribute, isShowDatasets}) => {
      // this.isShowAttribute = isShowAttribute;
      this.entities = entities;
      this.entity = entity;
      // this.displayDataSets = isShowDatasets;
    });

  }

  getEntitiesByProject(): void {
    if (this.project.id) {
      // @ts-ignore
      this.entityService.getEntitiesByProject(this.project.id.toLowerCase()).subscribe((res: Response) => {
        const entities = res.data;
        this.isBlock = false;
        this.store.dispatch(controlEntities({entities: entities}));
      });
    }
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

  onShowEntitiesList(i: number) {
    this.selectedEntity = this.entities[i];
    this.showEntities = false;
    this.showEntitiesList = true;
  }

  onShowHome($event: ReturnData) {
    delete this.selectedEntity;
    this.showEntities = $event.value;
    switch ($event.id) {
      case 'create':
        this.showCreateEdit = false;
        break;
      case 'list':
        this.showEntitiesList = false;
        break;
      case 'edit':
        this.showEditEntity = false;
        break;
    }
  }

  onEditEntity(i: number) {
    this.selectedEntity = this.entities[i];
    this.showEntities = false;
    this.showCreateEdit = true;
  }

  onDelete(i: number) {
    this.selectedEntity = this.entities[i];
    this.confirmDeleteEntity();
  }

  cancelDelete() {
    this.selectedEntity = '';
    this.isDelete = false;
  }

  confirmDeleteEntity() {
    if (this.entity.attributes && this.entity.attributes.length) {
      this.toastMessage({
        type: 'error',
        message: 'No se puede eliminar la entidad porque contiene atributos',
        life: 5000,
      });
    } else {
      this.isDelete = true;
    }
  }

  deleteEntity() {
    if (this.selectedEntity.attributes && this.selectedEntity.attributes.length) {
      this.messageService.add({
          message: 'No se puede eliminar la entidad porque cotiene atributos',
          type: 'error',
          life: 5000,
        }
      );
    } else {
      this.isDelete = false;
      this.isBlock = true;
      this.entityService.deleteEntity(this.selectedEntity.id.toLowerCase()).subscribe((res: Response) => {
        if (res.error) {
          this.messageService.add({
            message: res.msg,
            type: 'error',
            life: 3000
          });
          this.isBlock = false;
        } else {
          this.messageService.add({
            message: "Eliminación exitosa",
            type: 'sucess',
            life: 3000
          });
          this.isBlock = false;
          this.getEntitiesByProject();
        }
      });
    }
  }

  toastMessage($event: ToastModel) {
    this.messageService.add($event);
  }
}
