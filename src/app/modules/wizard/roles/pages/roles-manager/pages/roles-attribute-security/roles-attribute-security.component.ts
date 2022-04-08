import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "@app/core/store/app.reducers";
import {Router} from "@angular/router";
import {RoleService} from "@app/modules/wizard/services/roles/role.service";
import {ToastService} from "ecapture-ng-ui";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {dropStyle} from "@app/core/models/dropdown/dropdown";
import {
  Role,
  SecurityEntities,
  Response,
  Entity,
  Attributes,
  SecurityEntity,
  RoleAttribute,
  Attribute
} from "@app/core/models";
import {DropdownModel} from "ecapture-ng-ui/lib/modules/dropdown/models/dropdown";
import {v4 as uuidv4} from 'uuid';
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

  public showConfirmDeleteEntity: boolean = false;
  public showConfirmDeleteAttribute: boolean = false;

  public role: Role = {};

  public entitiesGlobal: Entity[] = [];
  public entityAttributesGlobal: Attribute[] = [];
  public entityAttributesGlobalDrop: OptionsDropdown[] = [];
  public entitiesGlobalDrop: OptionsDropdown[] = [];
  public entitiesRole: SecurityEntity[] = [];
  public entityCreate: Entity = {};
  public entitySelected: SecurityEntity = this.entitiesRole[0];

  public attributesRole: RoleAttribute[] = [];
  public attributeSelected: RoleAttribute = this.attributesRole[0];
  public indexAttributeSelected: number = 0;
  public attributeForm: FormGroup;
  public isAttribute: boolean = false;
  public isExistAttributes: boolean = false;
  public isEditAttribute: boolean = false;

  //public indexEntity = 0;

  //entitiesList: Entity[] = [];
  //public indexEntityGlobal = 0;

  /*
  listEntity: SecurityEntities[] = [];
  newEntity: SecurityEntities = {};
  securityEntity: SecurityEntities[] = [];
  listEntityDrop: OptionsDropdown[] = [];

  listAttributes: Attributes[] = [];
  listAttributesDrop: OptionsDropdown[] = [];
  newAttribute: Attributes = {}; */

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private _roleService: RoleService,
    private _messageService: ToastService,
    private formBulder: FormBuilder,
  ) {
    this.attributeForm = this.formBulder.group({
      attribute_id: ['', [Validators.required]],
      value: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.isBlockPage = true;
    this.store.select('role').subscribe((res) => {
      const data = res.role
      this.role = JSON.parse(JSON.stringify(data));
      if (!this.role || Object.keys(this.role).length === 0) {
        this.router.navigateByUrl('wizard/roles');
      } else{
        if(this.role.security_entities){
          for(let entitySecure of this.role.security_entities){
            this.entitiesRole.push(entitySecure);
          }
        }
      }

      console.log(this.role);
      this.isBlockPage = false;
    });

    this.initEntitiesGlobal();

    //this.initRolesSecurity();
  }

  initEntitiesGlobal() {
    this._roleService.getEntitiesPrueba().subscribe((res) => {
      if(!res.error){
        this.entitiesGlobal = res.data;
        for (let entity of this.entitiesGlobal) {
          this.entitiesGlobalDrop.push({
            label: entity.name || '',
            value: entity.id || '',
          });
        }
      }else{
        this._messageService.add({ type: 'error', message: 'ERROR: No se pudo cargar las entidades', life: 5000 });
      }
    });
  }

/*
  getInitAttributes(index: number, entity: Entity) {
    const entityTemp = this.entitiesList.find((el) => el.id?.toLocaleLowerCase() === entity.id?.toLocaleLowerCase());
    if (entityTemp?.attributes) {
      this.listAttributes = entityTemp.attributes;
      for (let item of this.listAttributes) {
        this.listAttributesDrop.push({
          label: item.name_attribute + '',
          value: item.id + ''
        });
      }
    }
    this.isAttribute = true;
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

  deleteSecurityEntity(index: number) {
    this.indexEntity = index;
    const data = Object(this.listEntity[index]);
    const info = this.role.security_entities?.find((el) => el.id?.toLocaleLowerCase() === data.id.toLocaleLowerCase());
    const validacion = info?.role_attribute;
    if (validacion !== null && validacion?.length !== length) {
      this._messageService.add({
        type: 'error',
        message: 'No se puede Eliminar, la Entidad tiene Atrributos',
        life: 5000
      });
    } else {
      this.showConfirmDeleteEntity = true;
    }
  }

  confirmDialogDeleteEntity(event: boolean) {
    if (event) {
      this._roleService
        .deleteRolesSecurityEntity(this.listEntity[this.indexEntity].id?.toLocaleLowerCase() + '')
        .subscribe((res: Response) => {
          if (res.error) {
            this._messageService.add({type: 'error', message: 'Error en la Eliminación' + res.msg, life: 5000});
          } else {
            this._messageService.add({type: 'success', message: 'Eliminación Exitosa Entidad' + res.msg, life: 5000});
            this.store.dispatch(deleteSecurity({index: this.indexEntity}));
            this.listEntity.splice(this.indexEntity, 1);
          }
          this.showConfirmDeleteEntity = false;
        });
    } else {
      this.showConfirmDeleteEntity = false;
    }
  }
*/

  selectEntity(idEntity: string) {
    this.entityCreate = this.entitiesGlobal.find(entity => entity.id === idEntity) || {};
  }

  createEntity() {
    this.isBlockPage = true;
    const idEntity = this.entityCreate.id;
    const dataEntity: SecurityEntities = {
      id: uuidv4().toLowerCase(),
      role_id: this.role.id?.toLocaleLowerCase(),
      entity: idEntity,
    };
    this._roleService.createRolesSecurityEntity(dataEntity).subscribe((res: Response) => {
      if (res.error) {
        this._messageService.add({type: 'error', message: 'Error en la Creación', life: 5000});
      } else {
        this._messageService.add({type: 'success', message: 'Creación Exitosa', life: 5000});
        this.entitiesRole.push({
          id: dataEntity.id,
          entity: this.entityCreate,
        });
        this.role.security_entities = this.entitiesRole;
      }
      this.isBlockPage = false;
    });
  }

  deleteEntity(entity: SecurityEntity) {
    this.entitySelected = entity;
    this.showConfirmDeleteEntity = true;
  }

  confirmDialogDeleteEntity(confirm: boolean){
    if (confirm) {
      if(this.entitySelected.role_attribute && this.entitySelected.role_attribute.length > 0){
        this.showConfirmDeleteEntity = false;
        this._messageService.add({type: 'error', message: 'No se pudo eliminar, la entidad tiene atributos', life: 5000});
      }else{
        console.log('ID Entidad Seleccionada:');
        console.log(this.entitySelected.id);
        this._roleService
          .deleteRolesSecurityEntity(this.entitySelected.id || '')
          .subscribe((res: Response) => {
            if (res.error) {
              this._messageService.add({type: 'error', message: 'Error en la Eliminación' + res.msg, life: 5000});
            } else {
              this._messageService.add({type: 'success', message: 'Eliminación Exitosa Entidad' + res.msg, life: 5000});
              this.entitiesRole = this.entitiesRole.filter(d => d.id !== this.entitySelected.id);
              this.role.security_entities = this.entitiesRole;
            }
            this.showConfirmDeleteEntity = false;
          });
      }
    } else {
      this.showConfirmDeleteEntity = false;
    }
  }

  showEntity(entity: SecurityEntity) {
    this.isBlockPage = true;

    this.attributesRole = [];
    this.entityAttributesGlobalDrop = [];
    const entityTemp = entity;
    this.entitySelected = JSON.parse(JSON.stringify(entityTemp));
    this.isAttribute = true;
    if(this.entitySelected.role_attribute && this.entitySelected.role_attribute.length > 0){
      const attributes = this.entitySelected.role_attribute;
      this.attributesRole = JSON.parse(JSON.stringify(attributes));
      this.isExistAttributes = true;
    }
    this.entityAttributesGlobal = this.entitiesGlobal.find(entityGlobal => entityGlobal.id === entity.entity?.id)?.attributes || [];
    for(let attribute of this.entityAttributesGlobal){
      this.entityAttributesGlobalDrop.push({
        label: attribute.description,
        value: attribute.id
      });
    }

    this.isBlockPage = false;
  }

  createAttribute() {
    this.isBlockPage = true;
    if(!this.attributeForm.invalid){
      const dataAttribute: Attributes = {
        id: uuidv4().toLowerCase(),
        attribute: this.attributeForm.value.attribute_id,
        value: this.attributeForm.value.value,
        roles_security_entities_id: this.entitySelected.id,
      };
      this._roleService.createRolesAttribute(dataAttribute)
        .subscribe((res: Response) =>{
          if (res.error) {
            this._messageService.add({type: 'error', message: 'Error, no se creó el atributo' + res.msg, life: 5000});
          } else {
            this._messageService.add({type: 'success', message: 'Creación de Atributo Exitosa' + res.msg, life: 5000});
            const entity = this.entitiesGlobal.find(entity => entity.id === this.entitySelected.entity?.id);
            const attribute = entity?.attributes?.find(attribute => attribute.id === dataAttribute.attribute);

            this.attributesRole.push({
              id: dataAttribute.attribute,
              value: dataAttribute.value,
              attribute: attribute
            });

            if(this.attributesRole.length > 0){
              this.isExistAttributes = true;
            }

            this.entitySelected.role_attribute = this.attributesRole;
            for(let i = 0; i < this.entitiesRole.length; i++){
              if(this.entitiesRole[i].id === this.entitySelected.id){
                this.entitiesRole[i] = this.entitySelected;
                break;
              }
            }
            this.role.security_entities = this.entitiesRole;

            this.isExistAttributes = true;
            this.attributeForm.reset();
            this.isBlockPage = false;
          }
        });
    }
  }

  editAttribute(index: number, attribute: RoleAttribute) {
    this.indexAttributeSelected = index;
    this.attributeSelected = attribute;
    this.isEditAttribute = true;
    if(attribute){
      this.attributeForm.patchValue({attribute_id:attribute.attribute?.id})
      this.attributeForm.patchValue({value:attribute.value})
    }
  }

  updateAttribute() {
    this.isBlockPage = true;
    if(!this.attributeForm.invalid){
      const dataAttribute: Attributes = {
        id: this.attributeSelected.id,
        attribute: this.attributeForm.value.attribute_id,
        value: this.attributeForm.value.value,
        roles_security_entities_id: this.entitySelected.id,
      };
      this._roleService.updateRolesAttribute(dataAttribute)
        .subscribe((res: Response) =>{
          if (res.error) {
            this._messageService.add({type: 'error', message: 'Error, no se actualizó el atributo' + res.msg, life: 5000});
          } else {
            this._messageService.add({type: 'success', message: 'Actualización de Atributo Exitosa' + res.msg, life: 5000});
            const entity = this.entitiesGlobal.find(entity => entity.id === this.entitySelected.entity?.id);
            const attribute = entity?.attributes?.find(attribute => attribute.id === dataAttribute.attribute);

            this.attributesRole[this.indexAttributeSelected].value = dataAttribute.value;
            this.attributesRole[this.indexAttributeSelected].attribute = attribute;

            if(this.attributesRole.length > 0){
              this.isExistAttributes = true;
            }

            this.entitySelected.role_attribute = this.attributesRole;
            for(let i = 0; i < this.entitiesRole.length; i++){
              if(this.entitiesRole[i].id === this.entitySelected.id){
                this.entitiesRole[i] = this.entitySelected;
                break;
              }
            }
            this.role.security_entities = this.entitiesRole;

            this.isEditAttribute = false;
            this.attributeForm.reset();
            this.isBlockPage = false;
          }
        });
    }
  }

  deleteAttribute(attribute: RoleAttribute) {
    this.attributeSelected = attribute;
    this.showConfirmDeleteAttribute = true;
  }

  confirmDialogDeleteAttribute(confirm: boolean){
    if (confirm) {
      this._roleService
        .deleteRolesAttribute(this.attributeSelected.id || '')
        .subscribe((res: Response) => {
          if (res.error) {
            this._messageService.add({type: 'error', message: 'Error en la Eliminación' + res.msg, life: 5000});
          } else {
            this._messageService.add({type: 'success', message: 'Eliminación Exitosa de Atributo' + res.msg, life: 5000});
            this.attributesRole = this.attributesRole.filter(d => d.id !== this.attributeSelected.id);
            if(this.attributesRole.length < 1){
              this.isExistAttributes = false;
            }

            this.entitySelected.role_attribute = this.attributesRole;
            for(let i = 0; i < this.entitiesRole.length; i++){
              if(this.entitiesRole[i].id === this.entitySelected.id){
                this.entitiesRole[i] = this.entitySelected;
                break;
              }
            }
            this.role.security_entities = this.entitiesRole;
          }
          this.showConfirmDeleteAttribute = false;
        });
    }else{
      this.showConfirmDeleteAttribute = false;
    }
  }



}
