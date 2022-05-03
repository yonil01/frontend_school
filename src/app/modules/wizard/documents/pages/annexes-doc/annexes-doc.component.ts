import {Component, OnInit} from '@angular/core';
import {Customer, DocTypes, Project, Response, ResponseAnnexeDoctype} from "@app/core/models";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
  AnnexeDoctypesRequestModel,
  AnnexeRequestModel, AttributeCommonConfig,
  DoctypeConfig,
  Required, RequiredAttribute, RequiredAttributeCommon, RequiredAttributeCommonRequestModel,
  RequiredDoctypes
} from "@app/core/models/config/annexe";
import {AnnexeService} from "@app/modules/wizard/documents/services/annexe/annexe.service";
import {Store} from "@ngrx/store";
import {AppState} from "@app/core/store/app.reducers";
import {Router} from "@angular/router";
import {v4 as uuidv4} from "uuid";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {ToastService} from "ecapture-ng-ui";
import {DoctypegroupService} from "@app/modules/wizard/services/doctypegroup/doctypegroup.service";
import {ConfirmationService} from "primeng/api";
import {onlyNumbers} from "@app/core/utils/validations/validations";
import {EntityService} from "@app/modules/wizard/services/entity/entity.service";
import {Attribute, Entity} from "@app/modules/wizard/entidades/models/entities.models";
import {DropdownModel} from "ecapture-ng-ui/lib/modules/dropdown/models/dropdown";
import {dropStyle} from "@app/core/models/dropdown/dropdown";

@Component({
  selector: 'app-annexes-doc',
  templateUrl: './annexes-doc.component.html',
  styleUrls: ['./annexes-doc.component.scss'],
  providers: [ToastService, ConfirmationService]
})

export class AnnexesDocComponent implements OnInit {

  public readonly toastStyle: ToastStyleModel = toastDataStyle;

  private client: Customer;
  private project: Project;
  public nameClient: string = '';
  public nameProject: string = '';

  public annexesDocForPag: Required[] = [];
  public isEditAnnexe = false;
  public isTab1 = true;

  public showOnlyCheckedTab1 = false;
  public showOnlyCheckedTab2 = false;

  public formAnnexe!: FormGroup;

  public doctype!: DocTypes;
  public doctypeAll: DocTypes[] = [];
  public doctypeConfiguration: DoctypeConfig[] = [];
  public annexesAll: Required[] = [];

  public entitiesAll: Entity[] = [];
  public attributesCommonConfig: AttributeCommonConfig[] = [];

  public annexeDisplayIndex!: number;
  public showConfirm = false;
  public showConfiguration = false;
  public showConfigAttribute = false;

  public annexeSelected!: Required;
  public doctype_required_selected_id!: string;
  public isBlockPage = true;
  public entitySelected = '';
  public isBlockOptions = false;

  public readonly dropStyle: DropdownModel = dropStyle;

  constructor(private _annexeService: AnnexeService, private _fb: FormBuilder, private store: Store<AppState>,
              private _route: Router, private _messageService: ToastService, private _confirmService: ConfirmationService,
              private _doctypeGroupService: DoctypegroupService, private _entityService: EntityService) {

    this.store.select('doctype').subscribe((doctypeState) => {
      doctypeState.doctypeGroups.forEach((e) => {
        if (e.doctypes) this.doctypeAll.push(...this.parseObject(e.doctypes));
      })
      const {doctype} = this.parseObject(doctypeState);
      if ('id' in doctype) {
        this.doctype = {...doctype};
        this.annexesAll = doctype.required || [];
      } else {
        this._route.navigate(["/wizard/documents"])
      }
    })


    this.project = JSON.parse(sessionStorage.getItem('project') || '');
    this.client = JSON.parse(sessionStorage.getItem('client') || '');
    this.nameClient = this.client.name + '';
    this.nameProject = this.project.name + '';
    this.loadEntities()

    this.formAnnexe = this._fb.group({
      name: ['', [Validators.required]],
      version: ['', [Validators.required]],
      is_active: [false, []],
    })

  }

  ngOnInit(): void {
  }

  private parseObject = (object: any) => JSON.parse(JSON.stringify(object))

  private loadEntities() {
    this._entityService.getEntitiesByProject(this.project.id).subscribe(({
      next: (res) => {
        if (res.error) {
          this._messageService.add({type: 'error', message: res.msg, life: 5000});
        } else {
          this.entitiesAll = res.data;
          this.isBlockPage = false;
        }
      }
    }))
  }

  public createdAnnexe() {
    if (this.formAnnexe.valid) {
      this.isBlockPage = true;
      const annexe: AnnexeRequestModel = this.getDataAnnexeRequest('create');
      this._annexeService.createRequired(annexe).subscribe({
        next: (res) => {
          if (res.error) {
            this._messageService.add({type: 'error', message: res.msg, life: 5000})
          } else {
            this.annexesAll = [...this.annexesAll, res.data];
            // this.annexesAll.push({...this.parseObject(res.data)})
            this.formAnnexe.reset({name: '', version: '', is_active: false});
            this._messageService.add({type: 'success', message: 'Anexo creado con éxito', life: 5000})
          }
          this.isBlockPage = false;
        },
        error: (err) => this.showMessageError('Error: ' + err.message)
      })
    } else {
      this.formAnnexe.markAllAsTouched();
    }
  }

  public onlyNumbers = (value: KeyboardEvent) => onlyNumbers(value);

  public loadDataForEdition(annexe: Required) {
    this.isBlockOptions = true;
    this.formAnnexe.reset({name: annexe.name, version: annexe.version, is_active: annexe.is_active});
    this.isEditAnnexe = true;
    this.movePositionTop();
  }

  public cancelEdition() {
    this.resetFormAnnexe();
    this.isEditAnnexe = this.isBlockOptions = false;
    this.annexeSelected = {} as Required;
  }

  public updateAnnexe() {
    if (this.formAnnexe.valid) {
      this.isBlockPage = true;
      const annexe: AnnexeRequestModel = this.getDataAnnexeRequest('update');
      this._annexeService.updateRequired(annexe).subscribe({
        next: (res: Response) => {
          if (res.error) {
            this.showMessageError(res.msg);
          } else {
            this._messageService.add({type: 'succes', message: 'Anexo actualizado correctamente!', life: 5000});
            this.annexesAll = this.annexesAll.map((_annexe) => _annexe.id === annexe.id ? res.data : _annexe)
            this.annexeSelected = {} as Required;
            this.isEditAnnexe = false;
            this.resetFormAnnexe();
          }
          this.isBlockPage = false;
        },
        error: () => this.showMessageError()
      })
    } else {
      this.formAnnexe.markAllAsTouched();
    }
  }

  public confirmDeleteAnnexe(isConfirm: boolean): void {
    if (isConfirm) {
      if (!this.annexeSelected.required_doctypes && !this.annexeSelected.required_attributes_common) {
        this.deleteAnnexe();
      } else {
        this._messageService.add({
          type: 'warning',
          message: 'No se puede eliminar el tipo de documento porque tiene entidades asociadas',
          life: 5000
        });
      }
    }
  }

  private deleteAnnexe() {
    this.isBlockPage = true;
    this._annexeService.deleteRequired(this.annexeSelected.id).subscribe({
      next: (res: Response) => {
        if (res.error) {
          this._messageService.add({type: 'error', message: res.msg, life: 5000});
        } else {
          this._messageService.add({type: 'succes', message: 'Anexo borrado correctamente!', life: 5000});
          this.annexesAll = this.annexesAll.filter((annexe) => annexe.id !== this.annexeSelected.id);
          this.annexeSelected = {} as Required;
        }
        this.isBlockPage = false;
      },
      error: () => this.showMessageError()
    })
  }

  private showMessageError(msg?: string) {
    this.isBlockPage = false;
    this._messageService.add({type: 'error', message: msg ? msg : 'Conexión perdida con el servidor!', life: 5000});
  }

  private getDataAnnexeRequest(type: string): AnnexeRequestModel {
    if (type === 'create') {
      return {
        id: uuidv4().toLowerCase(),
        name: this.formAnnexe.get('name')?.value,
        version: Number.parseInt(this.formAnnexe.get('version')?.value),
        is_active: this.formAnnexe.get('is_active')?.value,
        doctype_id: this.doctype.id?.toString() || ''
      }
    }
    return {
      id: this.annexeSelected.id,
      name: this.formAnnexe.get('name')?.value,
      version: this.formAnnexe.get('version')?.value,
      is_active: this.formAnnexe.get('is_active')?.value,
      doctype_id: this.doctype.id?.toString() || ''
    }
  }

  private movePositionTop() {
    document.querySelector('.Layout-body')?.scroll({
      top: 100,
      left: 100,
      behavior: 'smooth'
    })
  }

  private resetFormAnnexe() {
    this.formAnnexe.reset({name: '', version: '', is_active: false});
  }

  public loadConfiguration(annexe: Required) {
    this.showConfiguration = true;
    if (this.showConfiguration) {
      this.annexeSelected = annexe;
      this.doctypeConfiguration = this.doctypeAll.map((_doctype: DocTypes) => {
        const {doctypeRelated, annexeRequired, doctype_required_id} = this.validDoctypeRelatedForAnnexe(_doctype);
        return {
          id: _doctype.id!,
          name: _doctype.name,
          is_required: annexeRequired,
          is_related: doctypeRelated,
          doctype_required_id: doctype_required_id,
          SHOW: true
        }
      })
      this.isTab1 = true;
      this.attributesCommonConfig = [];
      this.entitySelected = '';
    } else {
      this.doctypeConfiguration = [];
      this.annexeSelected = {} as Required;
    }
  }

  private validDoctypeRelatedForAnnexe(doctype: DocTypes) {
    let doctypeRelated: RequiredDoctypes | undefined = undefined;
    let annexeRequired: boolean = false;
    let doctype_required_id: string = '';
    const annexe = this.annexesAll.find((_annexe: Required) => _annexe.id === this.annexeSelected.id)
    if (annexe?.required_doctypes) {
      doctypeRelated = annexe.required_doctypes.find(_doctype => _doctype.doctype_related_id === doctype.id)
      if (doctypeRelated) {
        doctype_required_id = doctypeRelated.id;
        annexeRequired = doctypeRelated?.is_required;
      }
    }

    return {doctypeRelated: !!doctypeRelated, annexeRequired, doctype_required_id};
  }

  public changeAnnexeRequiredDoctype(doctype: DoctypeConfig) {
    this.isBlockPage = true;
    if (!doctype.is_related) {
      this.createAnnexeRequiredDoctype(doctype);
    } else {
      this.deleteAnnexeRequiredDoctype(doctype);
    }
  }

  private createAnnexeRequiredDoctype(doctype: DoctypeConfig) {
    const requiredDoctype: AnnexeDoctypesRequestModel = this.getRequestRequiredDoctype(doctype, true);

    this._annexeService.createRequiredDoctype(requiredDoctype).subscribe({
      next: (res: ResponseAnnexeDoctype) => {
        if (res.error) {
          this.showMessageError('Error: ' + res.msg);
        } else {
          this._messageService.add({type: 'success', message: 'Doctype asociado con éxito', life: 5000});
          doctype.doctype_required_id = res.data.id;
          doctype.is_related = true;
          let annexe = this.annexesAll.find((_annexe: Required) => _annexe.id === this.annexeSelected.id);
          let newDoctypeRequired: RequiredDoctypes = {
            id: res.data.id,
            is_required: res.data.is_required,
            doctype_related_id: res.data.doctype_related_id,
            required_attributes: res.data.required_attributes ? res.data.required_attributes : [],
          }
          if (annexe?.required_doctypes) {
            annexe.required_doctypes.push(newDoctypeRequired)
          } else {
            // @ts-ignore
            annexe.required_doctypes = [newDoctypeRequired]
          }
          this.annexesAll = this.annexesAll.map((_annexe) => _annexe.id === annexe?.id ? annexe : _annexe);
        }
        this.isBlockPage = false;
      },
      error: (err: Error) => {
        this.showMessageError('Error: ' + err.message)
      }
    })
  }

  private deleteAnnexeRequiredDoctype(doctype: DoctypeConfig) {
    this._annexeService.deleteRequiredDoctype(doctype.doctype_required_id).subscribe({
      next: (res) => {
        if (res.error) {
          this.showMessageError('Error: ' + res.msg);
        } else {
          this._messageService.add({type: 'success', message: 'Doctype desasociado', life: 5000});
          this.doctypeConfiguration = this.doctypeConfiguration.map((_doctype) => {
            return _doctype.doctype_required_id === doctype.doctype_required_id ? {
              ..._doctype,
              is_required: false,
              is_related: false,
              doctype_required_id: ''
            } : _doctype
          });
          // @ts-ignore
          const annexe: Required = this.annexesAll.find((_annexe: Required) => _annexe.id === this.annexeSelected.id);
          if (annexe?.required_doctypes) {
            annexe.required_doctypes = annexe.required_doctypes?.filter((_required) => _required.id !== doctype.doctype_required_id);
          }
        }
        this.isBlockPage = false;
      },
      error: (err: Error) => this.showMessageError('Error: ' + err.message)
    })
  }

  public updateAnnexeRequiredDoctype(doctype: DoctypeConfig, isRequired: boolean) {

    this.isBlockPage = true;
    const request: AnnexeDoctypesRequestModel = this.getRequestRequiredDoctype(doctype);
    request.is_required = isRequired;

    this._annexeService.updateRequiredDoctype(request).subscribe({
      next: (res) => {
        if (res.error) {
          this.showMessageError('Error: ' + res.msg);
        } else {
          this._messageService.add({type: 'success', message: 'Se actualizó correctamente', life: 5000});
          doctype.is_required = isRequired;
        }
        this.isBlockPage = false;
      },
      error: (err: Error) => this.showMessageError('Error: ' + err.message)
    })
  }

  private getRequestRequiredDoctype(doctype: DoctypeConfig, isCreation?: boolean): AnnexeDoctypesRequestModel {
    if (isCreation) {
      return {
        id: uuidv4().toLowerCase(),
        is_required: false,
        required_id: this.annexeSelected.id,
        doctype_related_id: doctype.id
      }
    } else {
      return {
        id: doctype.doctype_required_id,
        is_required: false,
        required_id: this.annexeSelected.id,
        doctype_related_id: doctype.id
      }
    }
  }

  public loadConfigAttribute(doctype: DoctypeConfig) {
    this.doctype_required_selected_id = doctype.doctype_required_id;
    this.showConfigAttribute = true;
  }

  public getAnnexeById(id: string) {
    return this.annexesAll.find(annexe => annexe.id === id) || {} as Required
  }

  public filterListDoctype(filter: string, checked?: boolean) {
    this.doctypeConfiguration = this.doctypeConfiguration.map(_doctype => {
      return {
        ..._doctype,
        SHOW: checked ? (_doctype.is_related === checked && _doctype.name!.includes(filter)) : _doctype.name!.includes(filter)
      }
    })
  }

  public filterListAttributeCommon(filter: string, checked?: boolean) {
    this.attributesCommonConfig = this.attributesCommonConfig.map(_attr => {
      return {
        ..._attr,
        SHOW: checked ? (_attr.is_common === checked && _attr.name!.includes(filter)) : _attr.name!.includes(filter)
      }
    })
  }

  public changeSelectedEntity(entity_id: string) {
    const entity: Entity | undefined = this.entitiesAll.find(_entity => _entity.id === entity_id)
    if (entity?.attributes) {
      this.attributesCommonConfig = entity?.attributes.map(_attr => {
        const {attribute_common_id, is_common} = this.validAttributeCommonForAnnexe(_attr);
        return {
          id: _attr.id || '',
          name: _attr.name || '',
          required_id: this.annexeSelected.id,
          attribute_common_id: attribute_common_id,
          is_common: is_common,
          SHOW: true
        }
      })
    }
  }

  private validAttributeCommonForAnnexe(attribute: Attribute) {
    let attributeCommon: RequiredAttributeCommon | undefined = undefined;

    const annexe = this.annexesAll.find((_annexe: Required) => _annexe.id === this.annexeSelected.id);
    if (annexe?.required_attributes_common) {
      attributeCommon = annexe.required_attributes_common.find(_attrCommon => _attrCommon.attribute_id === attribute.id)
    }

    return {attribute_common_id: attributeCommon?.id || '', is_common: !!attributeCommon};
  }

  public changeAnnexeRequiredAttributeCommon(attribute: AttributeCommonConfig) {
    this.isBlockPage = true;
    if (!attribute.is_common) {
      this.createAnnexeAttributeCommon(attribute);
    } else {
      this.deleteAnnexeAttributeCommon(attribute);
    }
  }

  private createAnnexeAttributeCommon(attribute: AttributeCommonConfig) {
    this.isBlockPage = true;
    const request: RequiredAttributeCommonRequestModel = {
      id: uuidv4().toLowerCase(),
      attribute_id: attribute.id,
      required_id: this.annexeSelected.id,
    }
    this._annexeService.createRequiredAttributeCommon(request).subscribe({
      next: (res) => {
        if (res.error) {
          this.showMessageError('Error: ' + res.msg);
        } else {
          this._messageService.add({type: 'success', message: 'Asociación de atributo exitosa!', life: 5000});
          this.attributesCommonConfig = this.attributesCommonConfig.map((_attr) => {
            return (_attr.id === attribute.id) ? {..._attr, attribute_common_id: res.data.id, is_common: true} : _attr;
          });
          const annexe: Required | undefined = this.annexesAll.find((_annexe: Required) => _annexe.id === this.annexeSelected.id)
          if (annexe?.required_attributes_common) {
            annexe.required_attributes_common.push(res.data)
          }
        }
        this.isBlockPage = false;
      }
    })
  }

  private deleteAnnexeAttributeCommon(attribute: AttributeCommonConfig) {
    this.isBlockPage = true;

    this._annexeService.deleteRequiredAttributeCommon(attribute.attribute_common_id).subscribe({
      next: (res) => {
        if (res.error) {
          this.showMessageError('Error: ' + res.msg);
        } else {
          this._messageService.add({type: 'success', message: 'Desasociación de atributo exitosa', life: 5000});
          this.attributesCommonConfig = this.attributesCommonConfig.map((_attr) => {
            return (_attr.id === attribute.id) ? {..._attr, attribute_common_id: '', is_common: false} : _attr;
          });

          const annexe: Required | undefined = this.annexesAll.find((_annexe: Required) => _annexe.id === this.annexeSelected.id)
          if (annexe?.required_attributes_common) {
            annexe.required_attributes_common = annexe.required_attributes_common.filter(_attr => _attr.id !== attribute.attribute_common_id)
          }
        }
        this.isBlockPage = false;
      },
      error: (err: Error) => {
        this.showMessageError('Error: ' + err.message)
      }
    })
  }

  public updateRequiredAttributes(requiredAttribute: RequiredAttribute[]) {
    const annexe: Required | undefined = this.annexesAll.find((_annexe: Required) => _annexe.id === this.annexeSelected.id);
    const doctype = annexe?.required_doctypes?.find((_doctype) => _doctype.id === this.doctype_required_selected_id);
    if (doctype?.required_attributes) {
      doctype.required_attributes = requiredAttribute;
    }
  }

}
