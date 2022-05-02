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
  @Output() requiredAttributes = new EventEmitter<RequiredAttribute[]>();
  @Output() closeConfig = new EventEmitter<boolean>();

  public attributes: Attribute[] = [];
  public readonly dropStyle: DropdownModel = dropStyle;
  public readonly toastStyle: ToastStyleModel = toastDataStyle;

  public attributeDisplayIndex!: number;
  public attributesRequiredAll: RequiredAttribute[] = [];
  public attributeDocForPag: RequiredAttribute[] = [];

  public attributeSelected!: RequiredAttribute;
  public showConfirm = false;
  public showConfigAttribute = false;

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

  constructor(private _annexeService: AnnexeService, private _fb: FormBuilder,
              private _messageService: ToastService, private _cd: ChangeDetectorRef) {
    this.initForm();
  }

  ngAfterViewInit(): void {
    this._cd.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // @ts-ignore
    const doctypeRequired: RequiredDoctypes = this.annexe.required_doctypes?.find((_doctypeRequired: RequiredDoctypes) => _doctypeRequired.id === this.doctype_required_id)
    this.attributesRequiredAll = doctypeRequired?.required_attributes || [];
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
      preposition: [data ? data.preposition.Id : '', []],
    })
    this.attributesForm.push(newForm)
  }

  public validAddNewAttributeForm(index: number) {
    if (index + 1 === this.formsRequired.get('attributes')?.value.length) {
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
      // this._messageService.add({type: 'success', message: 'Exito', life: 55000})
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
        entity_id: dataForm[0].entity.id,
        attribute_id: dataForm[0].attribute.id,
        comparison_symbol_id: dataForm[0].comparison.id,
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

    debugger

    this.loadCreatedAttribute(requestAll);

  }

  private async loadCreatedAttribute(requestAll: RequiredAttributeRequestModel[]) {
    for await (const request of requestAll) {
      if (!await this.createRequiredAttribute(request)) return;
      this.requiredAttributes.emit(this.attributesRequiredAll);
    }
    this.initForm();
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

  public loadDataForEdition(attribute: RequiredAttribute, index: number) {
    const attr = this.attributesRequiredAll.find(_att => _att.id === attribute.id);
    this.initFormGroup();
    if (attr) {
      const newArray = this.attributesRequiredAll.slice(index);
      newArray.forEach(attr => {
        if (attr?.preposition) {
          this.addNewFormAttribute(attribute);
        } else {
          return;
        }
      })
    }
  }

  public deleteRequiredAttribute(attribute: RequiredAttribute) {
    this.isBlockPage = true;
    this._annexeService.deleteRequiredAttribute(attribute.id).subscribe({
      next: (res) => {
        if (res.error) {
          this._messageService.add({type: 'error', message: res.msg, life: 5000});
        } else {
          this._messageService.add({type: 'success', message: 'Atributo requerido eliminado', life: 5000});
          this.attributesRequiredAll = this.attributesRequiredAll.filter(_attr => _attr.id !== attribute.id);
          if (this.attributesRequiredAll.length) {
            const lastAttr = this.attributesRequiredAll[this.attributesRequiredAll.length - 1];
            const request: RequiredAttributeRequestModel = {
              id: lastAttr.id,
              entity_id: lastAttr.entity_id,
              attribute_id: lastAttr.attribute_id,
              comparison_symbol_id: lastAttr.comparison_symbol.Id,
              preposition_id: lastAttr.preposition.Id,
              required_doctype_id: this.doctype_required_id,
              value: lastAttr.value
            }
            this.updateRequiredAttribute(request);
          }
        }
        this.isBlockPage = false;
      },
      error: (err: Error) => {
        this.showMessageError('Error: ' + err.message)
      }
    })
  }

  private updateRequiredAttribute(request: RequiredAttributeRequestModel) {
    this._annexeService.updateRequiredAttribute(request).subscribe({
      next: (res) => {
        if (res.error) {
          this._messageService.add({type: 'error', message: res.msg, life: 5000});
        } else {
          this._messageService.add({type: 'success', message: 'Atributo requerido actualizado', life: 5000});
          debugger
        }
        this.isBlockPage = false;
      },
      error: (err: Error) => {
        this.showMessageError('Error: ' + err.message)
      }
    })
  }

  public getEntityNameById(id: string) {
    return this.entities.find(_entity => _entity.id === id)?.name
  }

  public getAttributeNameById(id: string) {
    return this.attributes.find(_entity => _entity.id === id)?.name
  }

  private showMessageError(msg?: string) {
    this.isBlockPage = false;
    this._messageService.add({type: 'error', message: msg ? msg : 'Conexión perdida con el servidor!', life: 5000});
  }

}
