import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataDrop, DropdownModel} from "ecapture-ng-ui/lib/modules/dropdown/models/dropdown";
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import {Data, TableModel} from "@app/ui/components/table/model/table.model";
import {StepModel} from "@app/ui/components/step/models/step-vertical-model";
import {CrudModel} from "@app/modules/administration/modules/teacher/models/teacher-crud-model/teacher-crud-constans";
import {
  NewUserAttribute, NewUserSecurityEntity,
  RoleAttribute,
  SecurityEntity,
  User, UserAttribute, UserSecurityEntity,
} from "@app/core/models";
import {FormControl} from "@angular/forms";
import {LocalStorageService} from "@app/core/services/local-storage/local-storage.service";
import {atRule} from "postcss";
import {showLoader} from "@app/modules/administration/modules/teacher/models/model-teacher/constans-teacher";
import {
  styleDropdown, styleTableEntitySegurity
} from "@app/modules/administration/modules/teacher/models/model-segurity-entities/constans-segurity-entities";
import {TeacherService} from "@app/modules/administration/modules/teacher/service/user/users.service";

@Component({
  selector: 'app-security-entities',
  templateUrl: './security-entities.component.html',
  styleUrls: ['./security-entities.component.scss']
})
export class SecurityEntitiesComponent implements OnInit {
  @Input() user: User;
  public styleDropdown: DropdownModel = styleDropdown;
  public styleTable: TableModel = styleTableEntitySegurity;
  public styleStep: StepModel = CrudModel;
  public securityEntities: SecurityEntity[] = [];
  public dataDropIdentity: DataDrop[];
  public dataDropAttribute: DataDrop[];
  public securityEntitySelected: UserSecurityEntity = {};
  public TeacherecurityEntitySelected: UserSecurityEntity;
  public showCreateSecurityEntity: boolean = false;
  public securityEntityAttributeSelectedForm = new FormControl('');
  public securityEntitiesSelectedForm = new FormControl('');
  public securityEntityAttributeSelected: RoleAttribute;
  public showCreateSecurityEntityAttribute: boolean = false;
  public showLoader: any = showLoader;
  public isBlockPage: boolean = false;
  @Output() showToast = new EventEmitter<any>();
  constructor(private Teacherervice: TeacherService,
              private localStorageService: LocalStorageService,) {
    this.user = {};
    this.dataDropIdentity = [];
    this.dataDropAttribute = [];
    this.TeacherecurityEntitySelected = {};
    this.securityEntityAttributeSelected = {};
  }

  ngOnInit(): void {
    this.getUserByID(this.user.dni!);
    this.securityEntitiesSelectedForm.valueChanges.subscribe((securityEntity: SecurityEntity) => {
      this.securityEntitySelected = securityEntity;
      this.dataDropAttribute = [];
      this.securityEntitySelected.attributes?.forEach((attribute: any) => {
        this.dataDropAttribute.push({
          label: String(attribute.attribute.name + ' ' + '-' + ' ' + attribute.value),
          value: attribute,
        })
      });
      this.findTeacherecurityEntity();
      this.securityEntityAttributeSelectedForm.setValue(null);
    });

    this.securityEntityAttributeSelectedForm.valueChanges.subscribe((securityEntityAttribute: RoleAttribute) => {
      this.securityEntityAttributeSelected = securityEntityAttribute;
      this.findTeacherecurityEntity();
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


  private getTeacherecurityEntityByID(userId: string): void {
    this.dataDropIdentity = [];
    this.Teacherervice.getUserByID(userId).subscribe((resp) => {
      if (resp.error) {
        this.addToast({
          type: 'error',
          message: resp.msg,
          life: 5000,
        });
        /*this.notifyUser('error', '', resp.msg, 5000);*/
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

  private getDataTable(user: User) {
    this.styleTable.dataSources = [];
    if (user.status) {
      /*subject.status.forEach((entity: any) => {
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
    const securityEntityPersistence: NewUserSecurityEntity = {
      id: uuidv4().toLowerCase(),
      entity: this.securityEntitiesSelectedForm.value.entity.id,
      user_id: this.user.dni?.toLowerCase(),
    };
    this.Teacherervice.createTeacherSecurityEntity(securityEntityPersistence).subscribe((resp) => {
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
        this.getUserByID(this.user.dni!.toLowerCase());
        this.showCreateSecurityEntity = false;
      }
    });
  }

  private getUserByID(userId: string): void {
    this.isBlockPage = true;
    this.Teacherervice.getUserByID(userId).subscribe((resp) => {
      if (resp.error) {
        this.isBlockPage = false;
        this.addToast({
          type: 'error',
          message: resp.msg,
          life: 5000,
        });
      } else {
        this.user = resp.data;
        this.getTeacherecurityEntityByID(this.localStorageService.getUserId().toLowerCase());
        this.findTeacherecurityEntity();
        this.getDataTable(this.user);
      }
    });
  }
  private findTeacherecurityEntity(): void {
    if (this.securityEntitySelected) {
      /*this.TeacherecurityEntitySelected = this.subject.status?.find(
        (se) => se.entity?.id!.toLowerCase() === this.securityEntitySelected.entity?.id!.toLowerCase(),
      )!;*/
      if (this.TeacherecurityEntitySelected) {
        this.showCreateSecurityEntity = false;
      } else {
        this.showCreateSecurityEntity = true;
      }
    } else {
      this.TeacherecurityEntitySelected = {};
      this.showCreateSecurityEntity = false;
    }

    this.isBlockPage = false;
  }

  deleteSecurityEntity(securityEntity: SecurityEntity): void {
    this.Teacherervice.deleteTeacherSecurityEntity(securityEntity.id!.toLowerCase()).subscribe((resp) => {
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
        this.getUserByID(this.user.dni!.toLowerCase());
      }
    });
  }

  createSecurityEntityAttribute(): void {
    const securityEntityPersistence: NewUserAttribute = {
      id: uuidv4().toLowerCase(),
      attribute: this.securityEntityAttributeSelectedForm.value.attribute.id,
      value: this.securityEntityAttributeSelected.value,
      enable: true,
      // Teacher_security_entities_id: this.TeacherecurityEntitySelected.id,
    };
    this.Teacherervice.createTeacherAttribute(securityEntityPersistence).subscribe((resp) => {
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
        this.getUserByID(this.user.dni!.toLowerCase());
        this.showCreateSecurityEntityAttribute = false;
      }
    });
  }

  deleteSecurityEntityAttribute(userAttribute: UserAttribute): void {
    this.Teacherervice.deleteTeacherAttributey(userAttribute.id!.toLowerCase()).subscribe((resp) => {
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
        this.getUserByID(this.user.dni!.toLowerCase());
      }
    });
  }

  public addToast(data: any): void {
    this.showToast.emit({type: data.type, message: data.message, life: data.life});
  }

}
