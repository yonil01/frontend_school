import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataDrop, DropdownModel} from "ecapture-ng-ui/lib/modules/dropdown/models/dropdown";
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import {Data, TableModel} from "@app/ui/components/table/model/table.model";
import {
  styleDropdown,
  styleTableEntitySegurity
} from "@app/modules/administration/modules/classroom/models/model-segurity-entities/constans-segurity-entities";
import {StepModel} from "@app/ui/components/step/models/step-vertical-model";
import {CrudModel} from "@app/modules/administration/modules/classroom/models/classroom-crud-model/classroom-crud-constans";
import {
  NewUserAttribute,
  NewUserSecurityEntity,
  RoleAttribute,
  SecurityEntity,
  Classroom, UserAttribute,
  UserSecurityEntity
} from "@app/core/models";
import {FormControl} from "@angular/forms";
import {LocalStorageService} from "@app/core/services/local-storage/local-storage.service";
import {atRule} from "postcss";
import {showLoader} from "@app/modules/administration/modules/classroom/models/model-classroom/constans-classroom";
import {NewClassroomAttribute, NewClassroomSecurityEntity, ClassroomSecurityEntity} from "@app/core/models/auth/classroom";
import {ClassroomsService} from "@app/modules/administration/modules/classroom/service/classroom/classroom.service";

@Component({
  selector: 'app-security-entities',
  templateUrl: './security-entities.component.html',
  styleUrls: ['./security-entities.component.scss']
})
export class SecurityEntitiesComponent implements OnInit {
  @Input() Classroom: Classroom;
  public styleDropdown: DropdownModel = styleDropdown;
  public styleTable: TableModel = styleTableEntitySegurity;
  public styleStep: StepModel = CrudModel;
  public securityEntities: SecurityEntity[] = [];
  public dataDropIdentity: DataDrop[];
  public dataDropAttribute: DataDrop[];
  public securityEntitySelected: ClassroomSecurityEntity = {};
  public ClassroomSecurityEntitySelected: ClassroomSecurityEntity;
  public showCreateSecurityEntity: boolean = false;
  public securityEntityAttributeSelectedForm = new FormControl('');
  public securityEntitiesSelectedForm = new FormControl('');
  public securityEntityAttributeSelected: RoleAttribute;
  public showCreateSecurityEntityAttribute: boolean = false;
  public showLoader: any = showLoader;
  public isBlockPage: boolean = false;
  @Output() showToast = new EventEmitter<any>();
  constructor(private ClassroomService: ClassroomsService,
              private localStorageService: LocalStorageService,) {
    this.Classroom = {};
    this.dataDropIdentity = [];
    this.dataDropAttribute = [];
    this.ClassroomSecurityEntitySelected = {};
    this.securityEntityAttributeSelected = {};
  }

  ngOnInit(): void {
    this.getClassroomByID(this.Classroom.dni!);
    this.securityEntitiesSelectedForm.valueChanges.subscribe((securityEntity: SecurityEntity) => {
      this.securityEntitySelected = securityEntity;
      this.dataDropAttribute = [];
      this.securityEntitySelected.attributes?.forEach((attribute: any) => {
        this.dataDropAttribute.push({
          label: String(attribute.attribute.name + ' ' + '-' + ' ' + attribute.value),
          value: attribute,
        })
      });
      this.findClassroomSecurityEntity();
      this.securityEntityAttributeSelectedForm.setValue(null);
    });

    this.securityEntityAttributeSelectedForm.valueChanges.subscribe((securityEntityAttribute: RoleAttribute) => {
      this.securityEntityAttributeSelected = securityEntityAttribute;
      this.findClassroomSecurityEntity();
    });
  };

  public eventTableOption(data:any): void {
    if (data.type === 'Delete') {
      this.deleteSecurityEntityAttribute(data.value);
    }
    if (data.type === 'Delete Max') {
      this.deleteSecurityEntity(data.value);
    }
  }


  private getClassroomSecurityEntityByID(ClassroomId: string): void {
    this.dataDropIdentity = [];
    this.ClassroomService.getClassroomByID(ClassroomId).subscribe((resp) => {
      if (resp.error) {
        this.addToast({
          type: 'error',
          message: resp.msg,
          life: 5000,
        });
        /*this.notifyClassroom('error', '', resp.msg, 5000);*/
      } else {
        this.securityEntities = resp.data.security_entities;
        if (this.securityEntities) {
          this.securityEntities.forEach((item: any) => {
            const newData = {
              label: item.entity.name,
              value: item
            }
            this.dataDropIdentity.push(newData);
          })
        }
      }
    });
  }


  public backStep(index: number) {
    this.styleStep.dataSourceStep.forEach((item: any, i:number) => {
      if (index === i) {
        item.status = 'Completed'
      }
      if ((index - 1) === i) {
        item.focus = true;
      } else {
        item.focus = false;
      }
    })
  }

  private getDataTable(Classroom: Classroom) {
    this.styleTable.dataSources = [];
    if (Classroom.status) {
      /*Classroom.status.forEach((entity: any) => {
        const newData: Data = {
          name: entity.entity.name,
          value: entity,
          datasource: []
        }
        if (entity.attributes) {
          entity.attributes.forEach((attribute: any) => {
            const newAttribute = {
              value: attribute,
              value1: attribute.attribute.name,
              value2: attribute.value
            }
            newData.datasource.push(newAttribute);
          })
        }
        this.styleTable.dataSources?.push(newData);
      })*/
    }

  }

  createSecurityEntity(): void {
    const securityEntityPersistence: NewClassroomSecurityEntity = {
      id: uuidv4().toLowerCase(),
      entity: this.securityEntitiesSelectedForm.value.entity.id,
      Classroom_id: this.Classroom.dni?.toLowerCase(),
    };
    this.ClassroomService.createClassroomsSecurityEntity(securityEntityPersistence).subscribe((resp) => {
      if (resp.error) {
        this.addToast({
          type: 'error',
          message: resp.msg,
          life: 5000,
        });
      } else {
        this.addToast({
          type: 'success',
          message: resp.msg,
          life: 5000,
        });
        this.getClassroomByID(this.Classroom.dni!.toLowerCase());
        this.showCreateSecurityEntity = false;
      }
    });
  }

  private getClassroomByID(ClassroomId: string): void {
    this.isBlockPage = true;
    this.ClassroomService.getClassroomByID(ClassroomId).subscribe((resp) => {
      if (resp.error) {
        this.isBlockPage = false;
        this.addToast({
          type: 'error',
          message: resp.msg,
          life: 5000,
        });
      } else {
        this.Classroom = resp.data;
        this.getClassroomSecurityEntityByID(this.localStorageService.getUserId().toLowerCase());
        this.findClassroomSecurityEntity();
        this.getDataTable(this.Classroom);
      }
    });
  }
  private findClassroomSecurityEntity(): void {
    if (this.securityEntitySelected) {
      /*this.ClassroomSecurityEntitySelected = this.Classroom.status?.find(
        (se) => se.entity?.id!.toLowerCase() === this.securityEntitySelected.entity?.id!.toLowerCase(),
      )!;*/
      if (this.ClassroomSecurityEntitySelected) {
        this.showCreateSecurityEntity = false;
      } else {
        this.showCreateSecurityEntity = true;
      }
    } else {
      this.ClassroomSecurityEntitySelected = {};
      this.showCreateSecurityEntity = false;
    }

    this.isBlockPage = false;
  }

  deleteSecurityEntity(securityEntity: SecurityEntity): void {
    this.ClassroomService.deleteClassroomsSecurityEntity(securityEntity.id!.toLowerCase()).subscribe((resp) => {
      if (resp.error) {
        this.addToast({
          type: 'error',
          message: resp.msg,
          life: 5000,
        });
      } else {
        this.addToast({
          type: 'success',
          message: resp.msg,
          life: 5000,
        });
        this.getClassroomByID(this.Classroom.dni!.toLowerCase());
      }
    });
  }

  createSecurityEntityAttribute(): void {
    const securityEntityPersistence: NewClassroomAttribute = {
      id: uuidv4().toLowerCase(),
      attribute: this.securityEntityAttributeSelectedForm.value.attribute.id,
      value: this.securityEntityAttributeSelected.value,
      enable: true,
      Classrooms_security_entities_id: this.ClassroomSecurityEntitySelected.id,
    };
    this.ClassroomService.createClassroomsAttribute(securityEntityPersistence).subscribe((resp) => {
      if (resp.error) {
        this.addToast({
          type: 'error',
          message: resp.msg,
          life: 5000,
        });
      } else {
        this.addToast({
          type: 'success',
          message: resp.msg,
          life: 5000,
        });
        this.getClassroomByID(this.Classroom.dni!.toLowerCase());
        this.showCreateSecurityEntityAttribute = false;
      }
    });
  }

  deleteSecurityEntityAttribute(ClassroomAttribute: UserAttribute): void {
    this.ClassroomService.deleteClassroomsAttributey(ClassroomAttribute.id!.toLowerCase()).subscribe((resp) => {
      if (resp.error) {
        this.addToast({
          type: 'success',
          message: resp.msg,
          life: 5000,
        });
      } else {
        this.addToast({
          type: 'success',
          message: resp.msg,
          life: 5000,
        });
        this.dataDropAttribute = [];
        this.getClassroomByID(this.Classroom.dni!.toLowerCase());
      }
    });
  }

  public addToast(data: any): void {
    this.showToast.emit({type: data.type, message: data.message, life: data.life});
  }

}
