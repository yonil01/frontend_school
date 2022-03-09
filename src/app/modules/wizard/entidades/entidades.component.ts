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

  constructor(private _localStorage: LocalStorageService,
              private store: Store<AppState>,
              private formBulder: FormBuilder,
              private entityService: EntityService,
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
    this.showEditEntity = true;
  }

  onDelete(i: number) {
    this.selectedEntity = this.entities[i];
    this.isDelete = true;
  }

  cancelDelete() {
    this.isDelete = false;
  }

  // confirmDeleteEntity() {
  //   if (this.entity.attributes && this.entity.attributes.length) {
  //     // this.confirmationService.confirm({
  //       message: 'No se puede eliminar la entidad porque cotiene atributos',
  //       header: 'Entidad',
  //       icon: 'pi pi-exclamation-triangle',
  //       accept: () => {},
  //       reject: () => {},
  //     });
  //   } else {
  //     this.confirmationService.confirm({
  //       message: '¿Está seguro de guardar los cambios? Esta acción puede afectar el modelo de datos',
  //       header: 'Confirmar Eliminación Entidad',
  //       icon: 'pi pi-exclamation-triangle',
  //       accept: () => {
  //         this.deleteEntity();
  //       },
  //       reject: () => {},
  //     });
  //   }
  // }

  deleteEntity() {
    this.isBlock = true;
    // @ts-ignore
    this.entityService.deleteEntity(this.selectedEntity.id.toLowerCase()).subscribe((res: Response) => {
      this.isBlock = false;
      this.getEntitiesByProject();
    });
  }
}
