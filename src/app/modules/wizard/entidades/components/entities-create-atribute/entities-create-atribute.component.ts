import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {fieldTypes, tagsHtml, validations, Types} from "@app/modules/wizard/entidades/utils/const";
import {Attribute, Entity, Response} from "@app/core/models";
// @ts-ignore
import {v4 as uuidv4} from 'uuid';
import {EntityService} from "@app/modules/wizard/entidades/services/entities.service";
import {Store} from "@ngrx/store";
import {AppState} from "@app/core/store/app.reducers";
import {addAttribute} from "@app/core/store/actions/entity.action";
import {ReturnData} from "@app/modules/wizard/entidades/models/entities.models";

@Component({
  selector: 'app-entities-create-atribute',
  templateUrl: './entities-create-atribute.component.html',
  styleUrls: ['./entities-create-atribute.component.scss']
})
export class EntitiesCreateAtributeComponent implements OnInit {
  @Output()
  public onSubmit: EventEmitter<ReturnData> = new EventEmitter<ReturnData>();
  @Output()
  public message = new EventEmitter();
  @Input()
  public entity!: Entity;
  @Input()
  public attribute!: Attribute;
  public createAttributeForm: FormGroup;
  public fieldTypes: any;
  public validations: any;
  public tagsHtml: any;
  public types: any;
  public onCreateAttribute: boolean = false;
  public isBlock: boolean = false;
  public isEdit: boolean = false;

  constructor(private _fb: FormBuilder,
              private entityService: EntityService,
              private store: Store<AppState>,) {
    this.createAttributeForm = this._fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      tag_html: ['', Validators.required],
      type: ['', Validators.required],
      mask: ['', Validators.required],
      min_length: ['', Validators.required],
      max_length: ['', [Validators.required, this.menorMaxLength]],
      validation: ['', Validators.required],
      field_types: ['', Validators.required],
      sequence: [null, Validators.required],
      regex: [''],
      dataset: [false],
      is_cipher: [false],
      required: [false],
      hidden: [false],
      disabled: [false],
      is_index: [false],
    })
    this.fieldTypes = fieldTypes;
    this.validations = validations;
    this.tagsHtml = tagsHtml;
    this.types = Types;
  }

  menorMaxLength(minLength: string, maxLength: string) {
    return (formGroup: FormGroup) => {
      const min = formGroup.controls[minLength];
      const max = formGroup.controls[maxLength];
      if (max && min.value <= max.value) {
        max.setErrors(null);
      } else {
        max.setErrors({menorMaxLength: true});
      }
    };
  }

  ngOnInit(): void {
    if (this.attribute) {
      this.createAttributeForm.patchValue(this.attribute);
      this.isEdit = true;
      this.createAttributeForm.controls['name'].disable();
      this.createAttributeForm.controls['field_types'].disable();
    }
  }

  onSendForm(state: string) {
    switch (state) {
      case 'submit':
        if (this.createAttributeForm.valid) {
          this.onCreateAttribute = false;
          this.createAttribute()
        } else {
          this.message.emit({
            type: 'error',
            message: 'Por favor, verifique los campos en rojo',
            life: 5000
          })
        }
        break;
      case 'cancel':
        this.onSubmit.emit({
          id: 'atribute',
          from: 'createAtribute',
          value: null
        });
        break;
      case 'sure':
        this.onCreateAttribute = true;
        break;
      case 'cancelSure':
        this.onCreateAttribute = false;
    }
  }

  createAttribute() {
    this.isBlock = true;
    if(this.attribute){
      this.createAttributeForm.enable()
      const attribute: Attribute = {...this.createAttributeForm.value, id: this.attribute.id};
      if (this.entity.id) {
        attribute.entities_id = this.entity.id.toLowerCase();
      }
      this.createAttributeForm.disable()
      const attributePersistense = JSON.parse(JSON.stringify(attribute));
      delete attributePersistense.entities_attributes_dataset;
      // @ts-ignore
      this.entityService.updateAttribute(attributePersistense).subscribe((res: Response) => {
        if (res.error) {
          this.message.emit({
            type: 'error',
            message: "Error en la creación: " + res.msg,
            life: 5000,
          });
          this.isBlock = false;
        } else {
          this.message.emit({
            type: 'success',
            message: "Creación Exitosa ",
            life: 5000,
          });
          this.isBlock = false;
          this.store.dispatch(addAttribute({attribute: attribute}));
          this.onSubmit.emit({
            id: 'atribute',
            from: 'updateAtributte',
            value: attributePersistense
          });
        }
      });
    } else {
      const attribute: Attribute = {...this.createAttributeForm.value, id: uuidv4().toLowerCase()};
      if (this.entity.id) {
        attribute.entities_id = this.entity.id.toLowerCase();
      }
      const attributePersistense = JSON.parse(JSON.stringify(attribute));
      delete attributePersistense.entities_attributes_dataset;
      // @ts-ignore
      this.entityService.createAttribute(attributePersistense).subscribe((res: Response) => {
        if (res.error) {
          this.message.emit({
            type: 'error',
            message: "Error en la creación: " + res.msg,
            life: 5000,
          });
          this.isBlock = false;
        } else {
          this.message.emit({
            type: 'success',
            message: "Creación Exitosa ",
            life: 5000,
          });
          this.isBlock = false;
          this.store.dispatch(addAttribute({attribute: attribute}));
          this.onSubmit.emit({
            id: 'atribute',
            from: 'createAtribute',
            value: attributePersistense
          });
        }
      });
    }

  }

  editAttribute() {
    const attribute: Attribute = {
      ...this.attribute,
      ...this.createAttributeForm.value,
      id: this.attribute.id?.toLowerCase(),
    };
  }
}

