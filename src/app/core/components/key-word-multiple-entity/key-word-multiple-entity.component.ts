import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {EntitiesMultipleDisplay, Entity} from "@app/core/models/getDoctypeGroups.model";
import {Document, EntityValue} from "@app/core/models";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DocumentService} from "@app/core/services/graphql/doc/document/document.service";
import {FieldsFormlyService} from "@app/core/services/fields-formly/fields-formly.service";

@Component({
  selector: 'app-key-word-multiple-entity',
  templateUrl: './key-word-multiple-entity.component.html',
  styleUrls: ['./key-word-multiple-entity.component.scss']
})
export class KeyWordMultipleEntityComponent implements OnInit, OnChanges {
  @Input() entities: Entity[] = [];
  @Input() document: Document = {};
  @Input() observableGetEntities!: FormControl;
  @Input() values: any[] = [];
  @Input() loadKeywordsMultiples: boolean = false;
  @Output() loadEntities = new EventEmitter<any[]>();
  index: number = 0;
  columns: any = [];
  entitiesValues: EntityValue[] = [];
  public entitiesMultiples: Entity[] = [];
  public entitiesMultiplesDisplay: EntitiesMultipleDisplay[] = [];
  entityData: any = {};
  private operations: any = {};
  showAccordion: boolean = false;

  constructor(
    private documentService: DocumentService,
    private fieldsFormly: FieldsFormlyService,
  ) {
  }

  ngOnInit(): void {
    if (this.observableGetEntities) {
      this.observableGetEntities.valueChanges.subscribe(() => {
        this.loadEntitiesPersistenses();
      });
    }
  }

  ngOnChanges(simpleChanges: SimpleChanges): void {
    if(simpleChanges?.loadKeywordsMultiples?.currentValue === true){
      this.loadEntitiesPersistenses()
    }
    this.getInitialData();
  }

  private getInitialData(): void {
    if (this.document) {
      this.documentService.getDocumentById(this.document.id?.toString() || '').subscribe((res: any) => {
        this.entitiesValues = res.data.entities;
        this.mapEntities();
      });
    } else {
      this.entitiesValues = [];
      this.mapEntities();
    }
  }

  private mapEntities() {
    this.entitiesMultiples = this.entities.filter((e) => !e.is_unique);

    this.entitiesMultiplesDisplay = this.entitiesMultiples.map((entity) => {
      return {
        display: false,
        entity: entity
      };
    });
    console.log(this.entitiesMultiplesDisplay)
    for (const entity of this.entitiesMultiples) {
      const columns = entity.attributes?.map((att) => ({header: att.name, field: att.name}));
      this.entityData[entity.id || 0] = {};
      this.entityData[entity.id || 0]['columns'] = columns;
      this.entityData[entity.id || 0]['fieldsFormly'] = this.fieldsFormly.getFormyFieldsByEntity(entity);

      const entitiesValuesFilter = this.entitiesValues.filter((ev) => ev.entity.name === entity.name);
      const rows = [];
      for (const ev of entitiesValuesFilter) {
        const row: any = {};
        if (ev.attributes_value && ev.attributes_value.length > 0) {
          for (const av of ev.attributes_value) {
            row[av.name || ''] = av.value;
          }
          if (!this.observableGetEntities) {
            row.entity_value_id = ev.attributes_id;
          }
        }
        rows.push(row);
      }
      const entityValue = this.values.find((e) => e.entity === entity.name);
      this.entityData[entity.id || 0]['rows'] = rows;
      this.entityData[entity.id || 0]['model'] = {};
      this.entityData[entity.id || 0]['form'] = new FormGroup(this.buildFormElementsGroup(this.entityData[entity.id || 0]['fieldsFormly'], entityValue ? entityValue.attributes : []));
      this.entityData[entity.id || 0]['indexSelect'] = null;
    }
    if (this.document) {
      this.showAccordion = true;
    } else {
      this.showAccordion = !!this.observableGetEntities;
    }
  }

  addRow(entity: Entity): void {
    const row: any = {};
    if (entity.attributes && entity.attributes.length > 0) {
      for (const att of entity.attributes) {
        row[att.name || ''] = this.entityData[entity.id || 0]['model'][att.id || 0];
      }
    }

    row['operation'] = 'create';
    this.entityData[entity.id || 0]['rows'].push(row);
  }

  cancel(entity: Entity): void {
    this.entityData[entity.id || 0]['form'].reset();
    this.entityData[entity.id || 0]['indexSelect'] = null;
  }

  editRow(entity: Entity): void {
    const index = this.entityData[entity.id || 0]['indexSelect'];
    if (
      !this.entityData[entity.id || 0]['rows'][index]['rowBackup'] &&
      this.entityData[entity.id || 0]['rows'][index]['operation'] !== 'create'
    ) {
      this.entityData[entity.id || 0]['rows'][index]['rowBackup'] = JSON.parse(
        JSON.stringify(this.entityData[entity.id || 0]['rows'][index]),
      );
    }
    if (entity.attributes && entity.attributes.length > 0) {
      for (const att of entity.attributes) {
        this.entityData[entity.id || 0]['rows'][index][att.name || ''] = this.entityData[entity.id || '']['form'].get(att.id).value;
      }
    }
    if (!this.entityData[entity.id || 0]['rows'][index]['operation']) {
      this.entityData[entity.id || 0]['rows'][index]['operation'] = 'update';
    }

    this.entityData[entity.id || 0]['indexSelect'] = null;
  }

  backRow(entity: Entity, rowData: any, index: number): void {
    this.entityData[entity.id || 0]['rows'][index] = rowData['rowBackup'];
    delete this.entityData[entity.id || 0]['rows'][index]['rowBackup'];
  }

  loadEntityValue(entity: Entity, rowData: any, index: number): void {
    this.entityData[entity.id || 0]['indexSelect'] = index;
    if (entity.attributes && entity.attributes.length > 0) {
      for (const att of entity.attributes) {
        this.entityData[entity.id || 0]['form'].get(att.id).setValue(rowData[att.name || '']);
      }
    }
  }

  deleteEntityValue(entity: any, index: number): void {
    if (this.entityData[entity.id]['rows'][index]['entity_value_id']) {
      this.entityData[entity.id]['rows'][index]['operation'] = 'delete';
    } else {
      this.entityData[entity.id]['rows'].splice(index, 1);
    }
  }

  cancelDeleteEntityValue(entity: any, index: number): void {
    if (this.entityData[entity.id]['rows'][index]['rowBackup']) {
      this.entityData[entity.id]['rows'][index]['operation'] = 'update';
    } else {
      this.entityData[entity.id]['rows'][index]['operation'] = '';
    }
  }

  public loadEntitiesPersistenses(): void {
    const createEntitiesValues: any[] = [];
    for (const entity of this.entitiesMultiples) {
      const attributesValuesForm = this.entityData[entity.id || 0]['form'].value;
      const attributesValues = [];
      if (entity.attributes && entity.attributes?.length > 0 && entity.attributes) {
        for (const att of entity.attributes) {
          const attributeValue = {
            name: att.name,
            value: attributesValuesForm[att.id || ''],
          };
          attributesValues.push(attributeValue);
        }
        const attributesFiller = attributesValues.filter((att) => att.value);
        if (attributesFiller.length) {
          const value: any = {
            entity: entity.name,
            attributes: attributesValues,
          };
          createEntitiesValues.push(value);
        }
      }
    }
    this.loadEntities.emit(createEntitiesValues);
  }

  save(): void {
    const createEntitiesValues: any = [];
    const updateEntitiesValues: any = [];
    const deleteEntitiesValues: any = [];
    for (const entity of this.entitiesMultiples) {
      for (const row of this.entityData[entity.id || 0]['rows']) {
        const attributesValues = [];
        if (entity.attributes && entity.attributes.length > 0) {
          for (const att of entity.attributes) {
            const attributeValue = {
              name: att.name,
              value: row[att.name || ''],
            };
            attributesValues.push(attributeValue);
          }
          const attributesFiller = attributesValues.filter((att) => att.value);
          if (attributesFiller.length) {
            if (row['operation'] === 'update') {
              const value: any = {
                id: row['entity_value_id'],
                entity: entity.name,
                attributes: attributesValues,
              };
              updateEntitiesValues.push(value);
            } else if (row['operation'] === 'create') {
              const value: any = {
                entity: entity.name,
                attributes: attributesValues,
              };
              createEntitiesValues.push(value);
            } else if (row['operation'] === 'delete') {
              const value = {
                id: row['entity_value_id'],
                entity: entity.name,
              };
              deleteEntitiesValues.push(value);
            }
          }
        }
      }
    }

    if (updateEntitiesValues.length) {
      this.updateEntities(updateEntitiesValues);
    }

    if (createEntitiesValues.length) {
      this.createEntities(createEntitiesValues);
    }

    if (deleteEntitiesValues.length) {
      this.deleteEntities(deleteEntitiesValues);
    }
  }

  private updateEntities(entities: any): void {
    this.operations['update'] = false;
    this.documentService.updateEntityToDocument(entities, this.document.id?.toString() || '').subscribe((resp: any) => {
      this.operations['update'] = true;
      this.reloadData();
      if (resp.error) {
        /*this.messageService.add({
          key: 'mykey',
          severity: 'error',
          summary: '',
          detail: resp.msg,
          life: 3000,
        });*/
      } else {
        /*this.messageService.add({
          key: 'mykey',
          severity: 'success',
          summary: '',
          detail: resp.msg,
          life: 3000,
        });*/
      }
    });
  }

  private createEntities(entities: any): void {
    this.operations['create'] = false;
    this.documentService.NewEntityToDocument(entities, this.document.id?.toString() || '').subscribe((resp: any) => {
      this.operations['create'] = true;
      this.reloadData();
      if (resp.error) {
        /*this.messageService.add({
          key: 'mykey',
          severity: 'error',
          summary: '',
          detail: resp.msg,
          life: 3000,
        });*/
      } else {
        /*this.messageService.add({
          key: 'mykey',
          severity: 'success',
          summary: '',
          detail: resp.msg,
          life: 3000,
        });*/
      }
    });
  }

  private deleteEntities(entities: any): void {
    this.operations['delete'] = false;
    this.documentService.deleteEntityToDocument(entities, this.document.id?.toString() || '').subscribe((resp: any) => {
      this.operations['delete'] = true;
      this.reloadData();
      if (resp.error) {
        /*this.messageService.add({
          key: 'mykey',
          severity: 'error',
          summary: '',
          detail: resp.msg,
          life: 3000,
        });*/
      } else {
        /*this.messageService.add({
          key: 'mykey',
          severity: 'success',
          summary: '',
          detail: resp.msg,
          life: 3000,
        });*/
      }
    });
  }

  private reloadData(): void {
    for (const valueValid of Object.values(this.operations)) {
      if (!valueValid) return;
    }
    this.operations = {};
    this.getInitialData();
  }

  private buildFormElementsGroup(fields: any[], values: any[]): any {
    let form = {}
    for (const field of fields) {
      for (const fieldElement of field.fieldGroup) {
        Object.assign(form, {[fieldElement.key]: new FormControl(this.getValue(fieldElement.templateOptions.label, values), this.buildFormsValidator(fieldElement))});
      }
    }
    return form;
  }

  private buildFormsValidator(itemForm: any): any {
    const validators = [];
    if (itemForm.templateOptions.required) validators.push(Validators.required);

    return validators;
  }

  private getValue(key: string, values: any[]): string {
    for (const value of values) {
      if (value.name === key) {
        return value.value;
      }
    }
    return '';
  }

  public openAccordion(index: number): void {
    this.entitiesMultiplesDisplay[index].display = !this.entitiesMultiplesDisplay[index].display;
  }

  isCreate(entityName: any) : boolean{
    return this.values.find((e) => e.entity === entityName)
  }

}
