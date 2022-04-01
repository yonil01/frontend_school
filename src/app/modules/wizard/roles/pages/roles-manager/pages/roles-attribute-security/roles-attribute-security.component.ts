import { Component, OnInit } from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "@app/core/store/app.reducers";
import {Router} from "@angular/router";
import {RoleService} from "@app/modules/wizard/services/roles/role.service";
import {ToastService} from "ecapture-ng-ui";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {dropStyle} from "@app/core/models/dropdown/dropdown";
import {Role, SecurityEntities, Response, Entity, Attributes} from "@app/core/models";
import {DropdownModel} from "ecapture-ng-ui/lib/modules/dropdown/models/dropdown";
import {addSecurityEntities, deleteSecurity} from "@app/core/store/actions/roles.action";
import { v4 as uuidv4 } from 'uuid';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

interface OptionsDropdown {
  label: string;
  value: string;
}

@Component({
  selector: 'app-roles-attribute-security',
  templateUrl: './roles-attribute-security.component.html',
  styleUrls: ['./roles-attribute-security.component.scss']
})

export class RolesAttributeSecurityComponent implements OnInit {

  public readonly toastStyle: ToastStyleModel = toastDataStyle;
  public dropStyle: DropdownModel = dropStyle;
  public isBlockPage: boolean = false;
  public showConfirmDelete: boolean = false;
  public role: Role = {};
  public indexEntity = 0;

  securityEntitiesForm: FormGroup;

  entitiesList: Entity[] = [];
  public indexEntityGlobal = 0;

  listEntity: SecurityEntities[] = [];
  newEntity: SecurityEntities = {};
  securityEntity: SecurityEntities[] = [];
  listEntityDrop: OptionsDropdown[] = [];

  listAttributes: Attributes[] = [];
  listAttributesDrop: OptionsDropdown[] = [];
  newAttribute: Attributes = {};

  isAtributtes:boolean = false;
  isEditAtributte:boolean = false;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private _roleService: RoleService,
    private _messageService: ToastService,
    private formBulder: FormBuilder,
  ) {
    this.securityEntitiesForm = this.formBulder.group({
      Entidad: ['', [Validators.required]],
      Nombre: ['', [Validators.required]],
      Valor: ['', [Validators.required]],
      name_attrib: [''],
      name_entidad: [''],
    });
  }

  ngOnInit(): void {
    this.isBlockPage = true;
    this.store.select('role').subscribe((res) => {
      this.role = res.role;
      if (!this.role || Object.keys(this.role).length === 0) this.router.navigateByUrl('wizard/roles');
      this.isBlockPage = false;
      console.log(this.role);
    });
    this._roleService.getEntitiesPrueba().subscribe((res) => {
      this.entitiesList = res.data;
      for(let entity of this.entitiesList){
        this.listEntityDrop.push({
          label: entity.name +'',
          value: entity.id+'',
        });
      }
    });

    this.initRolesSecurity();
  }

  getInitAttributes(index:number, entity: Entity){
    const entityTemp = this.entitiesList.find((el) => el.id?.toLocaleLowerCase() === entity.id?.toLocaleLowerCase());
    if(entityTemp?.attributes){
      this.listAttributes = entityTemp.attributes;
      for(let item of this.listAttributes){
        this.listAttributesDrop.push({
          label: item.name_attribute+'',
          value: item.id+''
        });
      }
    }
    this.isAtributtes = true;
  }

  initRolesSecurity(): void {
    this.securityEntity = [];
    this.listEntity = [];
    this.listEntityDrop = [];
    if (this.role !== null) {
      if (this.role.security_entities) {
        this.listEntity = [];
        for (const security of this.role.security_entities) {
          const iden = JSON.parse(JSON.stringify(security.entity));
          const attributes = [];
          attributes.push(security.role_attribute);
          this.securityEntity.push({
            id: security.id,
            entity: iden.id,
            name_entities: iden.name,
            role_attribute: iden.attributes,
          });
        }
        this.listEntity = this.securityEntity;
        console.log(this.listEntity);
        //this.isEnabledTableSeguridad = false;
      } else {
        //this.isEnabledTableSeguridad = false;
        this.listEntity = [];
      }
    }
  }


  findEntities(event: string): void {
    console.log(event);
    for (const entity of this.entitiesList) {
      if(entity.id === event){
        this.newEntity.id = '';
        this.newEntity.entity = entity.id;
        this.newEntity.name_entities = entity.name;
        this.newEntity.role_attribute = entity.attributes;
      }
    }
  }

  findAttributes(event: string): void {
    console.log(event);
    for (const entity of this.entitiesList) {
      if(entity.id === event){
        this.newEntity.id = '';
        this.newEntity.entity = entity.id;
        this.newEntity.name_entities = entity.name;
        this.newEntity.role_attribute = entity.attributes;
      }
    }
  }

  deleteSecurityEntity(index: number) {
    this.indexEntity = index;
    const data = Object(this.listEntity[index]);
    const info = this.role.security_entities?.find((el) => el.id?.toLocaleLowerCase() === data.id.toLocaleLowerCase());
    const validacion = info?.role_attribute;
    if (validacion !== null && validacion?.length !== length) {
      this._messageService.add({type: 'error', message: 'No se puede Eliminar, la Entidad tiene Atrributos', life: 5000});
    } else {
      this.showConfirmDelete = true;
    }
  }

  confirmDialogDelete(event: boolean){
    if(event){
      this._roleService
        .deleteRolesSecurityEntity(this.listEntity[this.indexEntity].id?.toLocaleLowerCase()+'')
        .subscribe((res: Response) => {
          if (res.error) {
            this._messageService.add({type: 'error', message: 'Error en la Eliminación'+res.msg, life: 5000});
          } else {
            this._messageService.add({type: 'success', message: 'Eliminación Exitosa Entidad'+res.msg, life: 5000});
            this.store.dispatch(deleteSecurity({index: this.indexEntity }));
            this.listEntity.splice(this.indexEntity, 1);
          }
          this.showConfirmDelete = false;
        });
    }else{
      this.showConfirmDelete = false;
    }
  }

  createRolesSecurityEntity(){
    const idEntidad = this.newEntity.entity;
    const dataEntity: SecurityEntities = {
      id: uuidv4().toLowerCase(),
      role_id: this.role.id?.toLocaleLowerCase(),
      entity: idEntidad,
    };
    const entity = JSON.parse(JSON.stringify(dataEntity));
    this._roleService.createRolesSecurityEntity(entity).subscribe((res: Response) => {
      if (res.error) {
        this._messageService.add({type: 'error', message: 'Error en la Creación', life: 5000});
      } else {
        this._messageService.add({type: 'success', message: 'Creación Exitosa', life: 5000});
        this.listEntity.push({
          id: dataEntity.id,
          role_attribute: this.newEntity.role_attribute,
          role_id: dataEntity.role_id,
          entity: idEntidad,
          name_entities: this.newEntity.name_entities
        });
      }
    });
  }

  SECreateEntitiesAtribute(OpcEvent: Event) {
/*
    this.createRoleService.createRolesAttribute(attribut).subscribe((res: Response) => {
      if (res.error) {
        this.notifyUser('error', 'Error en la Creación', res.msg, 5000);
      } else {
        this.notifyUser('success', 'Creación Exitosa Atributos', res.msg, 5000);
        this.store.dispatch(addSecurityEntities({ securityEntities: { ...obj } }));
        this.isEnabledHeaderEntidad = true;
        this.isEnabledBtnEntidad = false;
        this.ngmEntities = null;
      }
    });*/
    this.securityEntitiesForm.reset();
  }


}
