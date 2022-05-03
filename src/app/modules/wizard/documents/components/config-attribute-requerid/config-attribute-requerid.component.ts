import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {
  Required,
  RequiredAttribute,
  RequiredAttributeRequestModel,
  RequiredDoctypes
} from "@app/core/models/config/annexe";
import {DropdownModel} from "ecapture-ng-ui/lib/modules/dropdown/models/dropdown";
import {dropStyle} from "@app/core/models/dropdown/dropdown";
import {Attribute, Entity} from "@app/modules/wizard/entidades/models/entities.models";
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {ToastService} from "ecapture-ng-ui";
import {v4 as uuidv4} from "uuid";
import {AnnexeService} from "@app/modules/wizard/documents/services/annexe/annexe.service";

@Component({
  selector: 'app-config-attribute-requerid',
  templateUrl: './config-attribute-requerid.component.html',
  styleUrls: ['./config-attribute-requerid.component.scss']
})
export class ConfigAttributeRequeridComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() entities: Entity[] = [];
  @Input() annexe!: Required;
  @Input() doctype_required_id!: string;
  @Output() updateRequiredAttributes = new EventEmitter<RequiredAttribute[]>();
  @Output() closeConfig = new EventEmitter<boolean>();

  public attributes: Attribute[] = [];
  public readonly dropStyle: DropdownModel = dropStyle;
  public readonly toastStyle: ToastStyleModel = toastDataStyle;

  public attributeDisplayIndex!: number;
  public attributesRequiredAll: RequiredAttribute[] = [];
  public attributeDocForPag: RequiredAttribute[] = [];

  public attributeSelected!: RequiredAttribute;

  public formsRequired!: FormGroup;
  public isBlockPage = false;

  public comparisonData = [
    {id: 1, name: 'Igual (=)'},
    {id: 2, name: 'Mayor (>)'},
    {id: 3, name: 'Menor (<)'},
    {id: 4, name: 'Mayor Igual (>=)'},
    {id: 5, name: 'Menor Igual (<=)'},
  ];

  public prepositionData = [
    {Id: 1, name: 'AND'},
    {Id: 2, name: 'OR'},
    {Id: 3, name: 'NONE'},
  ];

  public showForm: boolean = false;
  public isCreate: boolean = false;
  public canAddForm: boolean = false;

  public valueConfirm: { show: boolean, value: any } = {show: false, value: ''};
  public isBlockOptions = false;

  constructor(private _annexeService: AnnexeService, private _fb: FormBuilder,
              private _messageService: ToastService, private _cd: ChangeDetectorRef) {
    this.initForm();
  }

  ngAfterViewInit(): void {
    this._cd.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // @ts-ignore
    const doctypeRequired: RequiredDoctypes = this.annexe.required_doctypes?.find((_doctypeRequired: RequiredDoctypes) => _doctypeRequired.id === this.doctype_required_id);
    this.attributesRequiredAll = doctypeRequired?.required_attributes || [];
    this.showForm = !this.attributesRequiredAll.length;
    this.isCreate = !this.attributesRequiredAll.length;
    this.canAddForm = !this.attributesRequiredAll.length;
  }

  ngOnInit(): void {
  }

  private initForm() {
    this.formsRequired = this._fb.group({
      attributes: this._fb.array([])
    })

    this.addNewFormAttribute();
  }

  public initFormGroup() {
    this.formsRequired = this._fb.group({
      attributes: this._fb.array([])
    })
  }

  public get attributesForm(): FormArray {
    return this.formsRequired.get('attributes') as FormArray;
  }

  public addNewFormAttribute(data?: RequiredAttribute) {
    const newForm: FormGroup = this._fb.group({
      entity: [data ? data.entity_id : '', [Validators.required]],
      attribute: [data ? data.attribute_id : '', [Validators.required]],
      comparison: [data ? data.comparison_symbol.Id : '', [Validators.required]],
      value: [data ? data.value : '', [Validators.required]],
      preposition: [data ? data.preposition.Id : 3, []],
    })
    this.attributesForm.push(newForm)
  }

  public validAddNewAttributeForm(index: number) {
    if (this.canAddForm && index + 1 === this.formsRequired.get('attributes')?.value.length) {
      this.addNewFormAttribute();
    }
  }

  public changeSelectedEntity($form: AbstractControl) {
    $form.get('attribute')?.setValue('')
  }

  public getDATAttribute($form: AbstractControl) {
    const entity = $form.value.entity;
    return entity ? (this.entities.find(_entity => _entity.id === (typeof entity === 'string' ? entity : entity?.id))?.attributes || []) : [];
  }

  public validFormRequiredAttribute($form: AbstractControl, formControlName: string) {
    return $form.get(formControlName)?.errors && $form.get(formControlName)?.touched;
  }

  public validRequiredAttribute() {
    if (this.formsRequired.valid) {
      this.prepareDataRequiredAttribute();
    } else {
      this._messageService.add({type: 'warning', message: 'Complete los campos correctamente', life: 5000})
      this.formsRequired.markAllAsTouched();
    }
  }

  private prepareDataRequiredAttribute() {
    const dataForm = this.formsRequired.get('attributes')?.value;
    const requestAll: RequiredAttributeRequestModel[] = [];
    if (dataForm.length === 1) {
      requestAll.push({
        id: uuidv4().toLowerCase(),
        required_doctype_id: this.doctype_required_id,
        entity_id: dataForm[0].entity.id ? dataForm[0].entity?.id : dataForm[0].entity,
        attribute_id: dataForm[0].attribute.id ? dataForm[0].attribute.id : dataForm[0].attribute,
        comparison_symbol_id: dataForm[0].comparison.id ? dataForm[0].comparison.id : dataForm[0].comparison,
        preposition_id: dataForm[0].preposition ? dataForm[0].preposition : 3,
        value: dataForm[0].value,
      })
    } else {
      dataForm.forEach((data: any) => {
        requestAll.push({
          id: uuidv4().toLowerCase(),
          required_doctype_id: this.doctype_required_id,
          entity_id: data.entity.id,
          attribute_id: data.attribute.id,
          comparison_symbol_id: data.comparison.id,
          preposition_id: data.preposition ? data.preposition : 3,
          value: data.value,
        })
      })
    }

    this.loadCreatedAttribute(requestAll);

  }

  private async loadCreatedAttribute(requestAll: RequiredAttributeRequestModel[]) {
    this.isBlockPage = true;
    for await (const request of requestAll) {
      if (!await this.createRequiredAttribute(request)) {
        this.isBlockPage = false;
        return
      }
      this.updateRequiredAttributes.emit(this.attributesRequiredAll);
    }
    this.isBlockPage = false;
    this._messageService.add({type: 'success', message: 'Creación de atributos requeridos exitosa', life: 5000});
    this.initForm();
    this.isCreate = false;
    this.showForm = false;
  }

  private createRequiredAttribute(request: RequiredAttributeRequestModel) {
    return new Promise((resolve, _) => {
      this._annexeService.createRequiredAttribute(request).subscribe({
        next: (res) => {
          if (res.error) {
            this._messageService.add({type: 'error', message: res.msg, life: 5000});
            resolve(false)
          } else {
            this.attributesRequiredAll = [...this.attributesRequiredAll, res.data];
            resolve(true);
          }
        },
        error: (err: Error) => {
          this._messageService.add({type: 'error', message: err.message, life: 5000})
          resolve(false)
        }
      })
    })
  }

  public validUpdateRequiredAttribute() {
    if (this.formsRequired.valid) {
      const dataForm = this.formsRequired.get('attributes')?.value;
      const requestCreate: RequiredAttributeRequestModel[] = [];
      let requestUpdate: RequiredAttributeRequestModel;

      requestUpdate = {
        id: this.attributeSelected.id,
        required_doctype_id: this.doctype_required_id,
        entity_id: dataForm[0].entity.id ? dataForm[0].entity?.id : dataForm[0].entity,
        attribute_id: dataForm[0].attribute.id ? dataForm[0].attribute.id : dataForm[0].attribute,
        comparison_symbol_id: dataForm[0].comparison.id ? dataForm[0].comparison.id : dataForm[0].comparison,
        preposition_id: dataForm[0].preposition ? dataForm[0].preposition : 3,
        value: dataForm[0].value,
      }

      if (this.attributesForm.length > 1) {
        dataForm.slice(1).forEach((data: any) => {
          requestCreate.push({
            id: uuidv4().toLowerCase(),
            required_doctype_id: this.doctype_required_id,
            entity_id: data.entity.id,
            attribute_id: data.attribute.id,
            comparison_symbol_id: data.comparison.id,
            preposition_id: data.preposition ? data.preposition : 3,
            value: data.value,
          })
        })
      }

      this.setUpdateRequiredAttributes(requestUpdate, requestCreate)

    } else {
      this._messageService.add({type: 'warning', message: 'Complete los campos correctamente', life: 5000})
      this.formsRequired.markAllAsTouched();
    }
  }

  private async setUpdateRequiredAttributes(requestUpdate: RequiredAttributeRequestModel, requestCreate: RequiredAttributeRequestModel[]) {
    this.isBlockPage = true;
    const result = await this.updateRequiredAttribute(requestUpdate);

    if (!result) {
      this.isBlockPage = false;
      return;
    }

    this.updateRequiredAttributes.emit(this.attributesRequiredAll);

    if (requestCreate.length) {
      for await (const request of requestCreate) {
        if (!await this.createRequiredAttribute(request)) {
          this.isBlockPage = false;
          return
        }
        this.updateRequiredAttributes.emit(this.attributesRequiredAll);
      }
    }

    this.isBlockPage = false;
    if (result) this._messageService.add({type: 'success', message: 'Actualización exitosa', life: 5000});
    this.initForm();
    this.showForm = false;
  }

  public loadDataForEdition(attribute: RequiredAttribute, index: number) {
    this.isBlockOptions = true;
    const attr = this.attributesRequiredAll.find(_att => _att.id === attribute.id);
    this.initFormGroup();
    if (attr) {
      this.addNewFormAttribute(this.attributesRequiredAll[index]);
      this.showForm = true;
    }
    this.canAddForm = this.attributesRequiredAll.length === (index + 1)
  }

  public showModalConfirmDelete(attribute: RequiredAttribute, index: number) {
    this.valueConfirm.show = true;
    this.valueConfirm.value = {attribute, index}
  }

  public confirmOptionDelete(isConfirm: boolean) {
    if (isConfirm) {
      this.validateDeleteRequiredAttribute(this.valueConfirm.value.attribute, this.valueConfirm.value.index)
    }
    this.valueConfirm.show = false
  }

  public async validateDeleteRequiredAttribute(attribute: RequiredAttribute, index: number) {
    if (this.attributesRequiredAll.length !== (index + 1)) {
      this._messageService.add({
        type: 'error',
        message: 'Acción denegada, el atributo tiene otros atributos relacionados!',
        life: 5000
      });
    } else {
      this.isBlockPage = true;

      if (!await this.deleteRequireAttribute(attribute)) {
        this.isBlockPage = false
        return;
      }

      if (this.attributesRequiredAll.length >= 1) {
        const dataForm = this.attributesRequiredAll[index-1];
        const x = this.attributesRequiredAll;
        const requestUpdate = {
          id: dataForm?.id,
          required_doctype_id: this.doctype_required_id,
          entity_id: dataForm?.entity_id,
          attribute_id: dataForm?.attribute_id,
          comparison_symbol_id: dataForm?.comparison_symbol.Id,
          preposition_id: 3,
          value: dataForm?.value,
        }

        debugger

        if (!await this.updateRequiredAttribute(requestUpdate)) {
          this.isBlockPage = false
          return;
        }

      }

      this.isBlockPage = false;

      if (!this.attributesRequiredAll.length) {
        this.isCreate = this.showForm = true;
        console.log(this.showForm);
        console.log('show')
      }
    }
  }

  private deleteRequireAttribute(attribute: RequiredAttribute) {
    return new Promise((resolve, _) => {
      this._annexeService.deleteRequiredAttribute(attribute.id).subscribe({
        next: (res) => {
          if (res.error) {
            this._messageService.add({type: 'error', message: res.msg, life: 5000});
            resolve(false);
          } else {
            this._messageService.add({type: 'success', message: 'Atributo requerido eliminado', life: 5000});
            this.attributesRequiredAll = this.attributesRequiredAll.filter(_attr => _attr.id !== attribute.id);
            this.updateRequiredAttributes.emit(this.attributesRequiredAll);
            resolve(true);
          }
        },
        error: (err: Error) => {
          this.showMessageError('Error: ' + err.message);
          resolve(false);
        }
      })
    })
  }

  private updateRequiredAttribute(request: RequiredAttributeRequestModel) {
    return new Promise((resolve, _) => {
      this._annexeService.updateRequiredAttribute(request).subscribe({
        next: (res) => {
          if (res.error) {
            this._messageService.add({type: 'error', message: res.msg, life: 5000});
            resolve(false)
          } else {
            this.attributesRequiredAll = this.attributesRequiredAll.map(_attr => _attr.id === res.data.id ? res.data : _attr)
            resolve(true)
          }
        },
        error: (err: Error) => {
          this.showMessageError('Error: ' + err.message);
          resolve(false);
        }
      })
    })
  }

  public getEntityNameById = (id: string) => this.entities.find(_entity => _entity.id === id)?.name;

  public getAttributeNameById(entity_id: string, attribute_id: string) {
    const entity = this.entities.find(_entity => _entity.id === entity_id);
    return entity?.attributes?.find(_attr => _attr.id === attribute_id)?.name
  }

  private showMessageError(msg?: string) {
    this.isBlockPage = false;
    this._messageService.add({type: 'error', message: msg ? msg : 'Conexión perdida con el servidor!', life: 5000});
  }

  public deleteFormNext(index: number) {
    if ((index + 2) === this.attributesForm.length) {
      this.attributesForm.removeAt(index + 1);
      this.attributesForm.controls[index].get('preposition')?.setValue(3)
    }
  }

  public cancelFormRequiredAttribute() {
    this.initForm();
    this.showForm = this.isBlockOptions = false;
  }

  public getLengthForm = () => this.attributesForm.length;

  public getDisabled(index: number) {
    return this.getLengthForm() >= 2 && (index + 2 >= this.getLengthForm())
  }

}
