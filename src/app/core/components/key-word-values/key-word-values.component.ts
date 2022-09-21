import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Attribute, EntitiesMultipleDisplay, Entity} from '@app/core/models/getDoctypeGroups.model';
import {Store} from '@ngrx/store';
import {AppState} from '@app/core/store/app.reducers';
import {EntityValue} from '@app/core/models';
import {DocumentService} from '@app/core/services/graphql/doc/document/document.service';
import {HttpErrorResponse} from "@angular/common/http";
import {ToastService} from "ecapture-ng-ui";
import {Subscription} from "rxjs/internal/Subscription";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/modules/login/data/style/data.style";

@Component({
  selector: 'app-key-word-values',
  templateUrl: './key-word-values.component.html',
  styleUrls: ['./key-word-values.component.scss'],
  providers: [],
})
export class KeyWordValuesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() document: any;
  @Input() entities: Entity[] = [];
  @Input() values: any[] = [];
  @Input() observableGetEntities: FormControl = new FormControl;
  @Output() loadEntities = new EventEmitter<any[]>();
  public entitiesSimples: Entity[] = [];
  public entitiesSimplesDisplay: EntitiesMultipleDisplay[] = [];
  private _subscription: Subscription = new Subscription();
  public readonly toastStyle: ToastStyleModel = toastDataStyle;
  public form: any = {};
  models: any = {};
  public fields: { [key: string]: any[] } = {};
  public entitiesValues: EntityValue[] = [];
  showAccordion = false;
  operatios: any = {};

  public isLoading: boolean = false;
  public existDocument: boolean = false;

  constructor(
    private store: Store<AppState>,
    private documentService: DocumentService,
    private _messageService: ToastService,
  ) {
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  ngOnInit(): void {
    if (this.observableGetEntities) {
      this.observableGetEntities.valueChanges.subscribe((val) => {
        this.loadEntitiesPersistenses();
      });
    }
  }

  ngOnChanges(): void {
    this.getInitialData();
  }

  private getInitialData(): void {
    if (this.document) {
      this.isLoading = true;
      this._subscription.add(
        this.documentService.getDocumentById(this.document.id?.toString() || '').subscribe({
          next: (res) => {
            if (res.error) {
              this._messageService.add({type: 'error', message: res.msg, life: 5000});
            } else {
              if (res.data) {
                this.entitiesValues = res.data.entities;
                this.existDocument = true;
                this.mapEntities();
              } else {
                this._messageService.add({type: 'warning', message: 'el documento no presenta entidades', life: 5000});
              }
            }
            this.isLoading = false;
          },
          error: (err: HttpErrorResponse) => {
            console.error(err);
            this._messageService.add({type: 'error', message: 'Error al cargar el documento', life: 5000});
            this.isLoading = false;
          }
        }));
    } else {
      this.entitiesValues = [];
      this.mapEntities();
    }
  }

  private mapEntities(): void {
    this.form = {};
    this.models = {};
    this.fields = {};
    this.entitiesSimples = this.entities.filter((e) => e.is_unique);
    this.entitiesSimplesDisplay = this.entitiesSimples.map(entity => ({display: false, entity}));
    this.entitiesSimples.forEach((entity: any) => {
      this.fields[entity.id] = entity.attributes?.map((item: any) => this.buildElement(item));
      this.models[entity.id] = {};
      let attributes: { name: string, value: any }[];
      let entityValue = this.values.find((e) => e.entity === entity.name);
      if (!entityValue) {
        entityValue = this.entitiesValues.find((e) => e.entity.name === entity.name);
        attributes = entityValue ? entityValue.attributes_value : [];
      } else {
        attributes = entityValue.attributes;
      }
      this.form[entity.id] = this.buildFormElementsGroup(this.fields[entity.id], attributes);
    });
    if (this.document) {
      this.showAccordion = true;
    } else {
      this.showAccordion = !!this.observableGetEntities;
    }
  }

  private buildElement(att: Attribute): any {
    switch (att.type) {
      default:
        return {
          key: att.name,
          type: 'input',
          templateOptions: {
            label: att.description,
            required: false,
          },
        };
    }
  }

  public loadEntitiesPersistenses(): void {
    const createEntitiesValues: any[] = [];
    for (const keyEntity of Object.keys(this.form)) {
      const entity = this.entitiesSimples.find((entity) => entity.id === keyEntity);
      const attributesValues = Object.keys(this.form[keyEntity].value).map((key) => {
        return {name: key, value: this.form[keyEntity].value[key] ? this.form[keyEntity].value[key] : ''};
      });
      const attributesFiller = attributesValues.filter((att) => att.value);
      if (attributesFiller.length) {
        const value: any = {
          entity: entity?.name,
          attributes: attributesValues,
        };
        createEntitiesValues.push(value);
      }
    }
    this.loadEntities.emit(createEntitiesValues);
  }

  public submitForm(): void {
    const createEntitiesValues: any[] = [];
    const updateEntitiesValues: any[] = [];
    const deleteEntitiesValues: any[] = [];

    for (const keyEntity of Object.keys(this.form)) {
      const entityValue = this.entitiesValues.find((entity) => keyEntity === entity.entity.id);

      const entity = this.entitiesSimples.find((entity) => entity.id === keyEntity);
      const attributesValues = Object.keys(this.form[keyEntity].value).map((key) => ({
        name: key,
        value: this.form[keyEntity].value[key] ? this.form[keyEntity].value[key] : ''
      }));
      const attributesFiller = attributesValues.filter((att) => att.value);

      if (entityValue) {
        if (attributesFiller.length) {
          const value: any = {
            id: entityValue.attributes_id,
            entity: entity?.name,
            attributes: attributesValues,
          };
          updateEntitiesValues.push(value);
        } else {
          const value = {
            id: entityValue.attributes_id,
            entity: entityValue.entity.name,
          };
          deleteEntitiesValues.push(value);
        }
      } else {
        if (attributesFiller.length) {
          const value: any = {
            entity: entity?.name,
            attributes: attributesValues,
          };
          createEntitiesValues.push(value);
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
    this.isLoading = true;
    this._subscription.add(
      this.documentService.updateEntityToDocument(entities, this.document.id?.toString() || '').subscribe({
        next: (res) => {
          if (res.error) {
            this._messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            this._messageService.add({type: 'success', message: 'Entidades Actualizadas correctamente', life: 5000});
            this.reloadData();
          }
          this.isLoading = false;
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.isLoading = false;
          this._messageService.add({type: 'error', message: 'Error al actualizar el documento', life: 5000});
        },
      })
    );
  }

  private createEntities(entities: any): void {
    this.operatios['create'] = false;
    this.documentService.NewEntityToDocument(entities, this.document.id?.toString() || '').subscribe((resp: any) => {
      this.operatios['create'] = true;
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
    this.operatios['delete'] = false;
    this.documentService.deleteEntityToDocument(entities, this.document.id?.toString() || '').subscribe((resp: any) => {
      this.operatios['delete'] = true;
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
    for (const valueValid of Object.values(this.operatios)) {
      if (!valueValid) return;
    }
    this.operatios = {};
    this.getInitialData();
  }

  private buildFormElementsGroup(fields: any[], values: any[]): FormGroup {
    let form = new FormGroup({});
    for (const field of fields) {
      form.addControl(field.key, new FormControl(this.getValue(field.key, values), this.buildFormsValidator(field)));
    }
    return form;
  }

  private getValue(key: string, values: any[]): string {
    for (const value of values) {
      if (value.name === key) {
        return value.value;
      }
    }
    return '';
  }

  private buildFormsValidator(itemForm: any): any {
    const validators = [];
    if (itemForm.templateOptions.required) validators.push(Validators.required);

    return validators;
  }

  public openAccordion(index: number): void {
    this.entitiesSimplesDisplay[index].display = !this.entitiesSimplesDisplay[index].display;
  }

}
