import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataDrop, DropdownModel} from "ecapture-ng-ui/lib/modules/dropdown/models/dropdown";
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import {Data, TableModel} from "@app/ui/components/table/model/table.model";
import {
  styleDropdown,
  styleTableEntitySegurity
} from "@app/modules/administration/modules/subject/models/model-segurity-entities/constans-segurity-entities";
import {StepModel} from "@app/ui/components/step/models/step-vertical-model";
import {CrudModel} from "@app/modules/administration/modules/subject/models/subject-crud-model/subject-crud-constans";
import {
  NewUserAttribute,
  NewUserSecurityEntity,
  RoleAttribute,
  SecurityEntity,
  Subject, UserAttribute,
  UserSecurityEntity
} from "@app/core/models";
import {FormControl} from "@angular/forms";
import {LocalStorageService} from "@app/core/services/local-storage/local-storage.service";
import {atRule} from "postcss";
import {showLoader} from "@app/modules/administration/modules/subject/models/model-subject/constans-subject";
import {NewSubjectAttribute, NewSubjectSecurityEntity, SubjectSecurityEntity} from "@app/core/models/auth/subject";
import {SubjectsService} from "@app/modules/administration/modules/subject/service/subject/subject.service";

@Component({
  selector: 'app-security-entities',
  templateUrl: './security-entities.component.html',
  styleUrls: ['./security-entities.component.scss']
})
export class SecurityEntitiesComponent implements OnInit {
  @Input() Subject: Subject;
  public styleDropdown: DropdownModel = styleDropdown;
  public styleTable: TableModel = styleTableEntitySegurity;
  public styleStep: StepModel = CrudModel;
  public securityEntities: SecurityEntity[] = [];
  public dataDropIdentity: DataDrop[];
  public dataDropAttribute: DataDrop[];
  public securityEntitySelected: SubjectSecurityEntity = {};
  public SubjectSecurityEntitySelected: SubjectSecurityEntity;
  public showCreateSecurityEntity: boolean = false;
  public securityEntityAttributeSelectedForm = new FormControl('');
  public securityEntitiesSelectedForm = new FormControl('');
  public securityEntityAttributeSelected: RoleAttribute;
  public showCreateSecurityEntityAttribute: boolean = false;
  public showLoader: any = showLoader;
  public isBlockPage: boolean = false;
  @Output() showToast = new EventEmitter<any>();
  constructor(private SubjectService: SubjectsService,
              private localStorageService: LocalStorageService,) {
    this.Subject = {};
    this.dataDropIdentity = [];
    this.dataDropAttribute = [];
    this.SubjectSecurityEntitySelected = {};
    this.securityEntityAttributeSelected = {};
  }

  ngOnInit(): void {
    this.getSubjectByID(this.Subject.dni!);
    this.securityEntitiesSelectedForm.valueChanges.subscribe((securityEntity: SecurityEntity) => {
      this.securityEntitySelected = securityEntity;
      this.dataDropAttribute = [];
      this.securityEntitySelected.attributes?.forEach((attribute: any) => {
        this.dataDropAttribute.push({
          label: String(attribute.attribute.name + ' ' + '-' + ' ' + attribute.value),
          value: attribute,
        })
      });
      this.findSubjectSecurityEntity();
      this.securityEntityAttributeSelectedForm.setValue(null);
    });

    this.securityEntityAttributeSelectedForm.valueChanges.subscribe((securityEntityAttribute: RoleAttribute) => {
      this.securityEntityAttributeSelected = securityEntityAttribute;
      this.findSubjectSecurityEntity();
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


  private getSubjectSecurityEntityByID(SubjectId: string): void {
    this.dataDropIdentity = [];
    this.SubjectService.getSubjectByID(SubjectId).subscribe((resp) => {
      if (resp.error) {
        this.addToast({
          type: 'error',
          message: resp.msg,
          life: 5000,
        });
        /*this.notifySubject('error', '', resp.msg, 5000);*/
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

  private getDataTable(Subject: Subject) {
    this.styleTable.dataSources = [];
    if (Subject.status) {
      /*Subject.status.forEach((entity: any) => {
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
    const securityEntityPersistence: NewSubjectSecurityEntity = {
      id: uuidv4().toLowerCase(),
      entity: this.securityEntitiesSelectedForm.value.entity.id,
      Subject_id: this.Subject.dni?.toLowerCase(),
    };
    this.SubjectService.createSubjectsSecurityEntity(securityEntityPersistence).subscribe((resp) => {
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
        this.getSubjectByID(this.Subject.dni!.toLowerCase());
        this.showCreateSecurityEntity = false;
      }
    });
  }

  private getSubjectByID(SubjectId: string): void {
    this.isBlockPage = true;
    this.SubjectService.getSubjectByID(SubjectId).subscribe((resp) => {
      if (resp.error) {
        this.isBlockPage = false;
        this.addToast({
          type: 'error',
          message: resp.msg,
          life: 5000,
        });
      } else {
        this.Subject = resp.data;
        this.getSubjectSecurityEntityByID(this.localStorageService.getUserId().toLowerCase());
        this.findSubjectSecurityEntity();
        this.getDataTable(this.Subject);
      }
    });
  }
  private findSubjectSecurityEntity(): void {
    if (this.securityEntitySelected) {
      /*this.SubjectSecurityEntitySelected = this.Subject.status?.find(
        (se) => se.entity?.id!.toLowerCase() === this.securityEntitySelected.entity?.id!.toLowerCase(),
      )!;*/
      if (this.SubjectSecurityEntitySelected) {
        this.showCreateSecurityEntity = false;
      } else {
        this.showCreateSecurityEntity = true;
      }
    } else {
      this.SubjectSecurityEntitySelected = {};
      this.showCreateSecurityEntity = false;
    }

    this.isBlockPage = false;
  }

  deleteSecurityEntity(securityEntity: SecurityEntity): void {
    this.SubjectService.deleteSubjectsSecurityEntity(securityEntity.id!.toLowerCase()).subscribe((resp) => {
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
        this.getSubjectByID(this.Subject.dni!.toLowerCase());
      }
    });
  }

  createSecurityEntityAttribute(): void {
    const securityEntityPersistence: NewSubjectAttribute = {
      id: uuidv4().toLowerCase(),
      attribute: this.securityEntityAttributeSelectedForm.value.attribute.id,
      value: this.securityEntityAttributeSelected.value,
      enable: true,
      Subjects_security_entities_id: this.SubjectSecurityEntitySelected.id,
    };
    this.SubjectService.createSubjectsAttribute(securityEntityPersistence).subscribe((resp) => {
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
        this.getSubjectByID(this.Subject.dni!.toLowerCase());
        this.showCreateSecurityEntityAttribute = false;
      }
    });
  }

  deleteSecurityEntityAttribute(SubjectAttribute: UserAttribute): void {
    this.SubjectService.deleteSubjectsAttributey(SubjectAttribute.id!.toLowerCase()).subscribe((resp) => {
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
        this.getSubjectByID(this.Subject.dni!.toLowerCase());
      }
    });
  }

  public addToast(data: any): void {
    this.showToast.emit({type: data.type, message: data.message, life: data.life});
  }

}
