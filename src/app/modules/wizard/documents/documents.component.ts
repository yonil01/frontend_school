import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  Attribute,
  Customer,
  DocTypeGroups,
  DocTypes,
  DocTypesDisplay,
  Entity,
  Project
} from "@app/core/models";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Store} from "@ngrx/store";
import {AppState} from "@app/core/store/app.reducers";
import {ToastService} from "ecapture-ng-ui";
import {
  controlDoctypegroups,
  showDoctypegroup
} from "@app/core/store/actions/doctype.action";
import {DoctypegroupService} from "@app/modules/wizard/services/doctypegroup/doctypegroup.service";
import {Subscription} from "rxjs/internal/Subscription";
import {HttpErrorResponse} from "@angular/common/http";
import {v4 as uuidv4} from 'uuid';
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {DropdownModel} from "ecapture-ng-ui/lib/modules/dropdown/models/dropdown";
import {dropStyle} from "@app/core/models/dropdown/dropdown";
import { IconsMaterial } from '@app/core/constants/icons/material-icons';

interface OptionsDropdown {
  label: string;
  value: string;
}

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit, OnDestroy {

  private _subscription: Subscription = new Subscription();
  public readonly toastStyle: ToastStyleModel = toastDataStyle;
  public readonly dropStyle: DropdownModel = dropStyle;
  public isBlockPage: boolean = false;

  public docTypeGroups: DocTypeGroups[] = [];
  public docTypeGroupsPagination: DocTypeGroups[] = [];
  public docTypeGroupSelected!: DocTypeGroups;
  public docTypesDisplay: DocTypesDisplay[] = [];
  public docTypesDisplayPagination: DocTypesDisplay[] = [];
  public docTypeSelected!: DocTypes;
  public storages: any[] = [];
  public typeSupport: any[] = [];
  public format: any[] = [];
  public disposition_final: any[] = [];
  docTypes: DocTypes[] = [];
  docTypeGroupForm: FormGroup;
  doctypeGruop!: DocTypeGroups;
  autoName: DocTypes = {};
  public docEntity: DocTypes = {};
  indexAutoname: number = 0;
  project: Project = {
    customers_id: "",
    department: "",
    description: "",
    email: "",
    id: "",
    name: "",
    phone: "",
    product_owner: ""
  };
  client: Customer = {};
  valorCode: string = '';
  selectedAttribute!: Attribute;
  indexAttribute: number = 0;
  validateAutoname: string[] = [];
  validateEntity: string[] = [];
  entity: Entity = {};
  entidades: string[] = [];

  // Listar Entidades
  selectedOptions: any[] = [];
  selectedEntities: any[] = [];

  isShowDoctypegroup = false;
  isShowAddDocType = false;
  isShowAddAutoname = false;
  isShowEditEntity = false;

  columnsDocTypes: any[] = [];
  public view: string = 'docTypesGroup';
  public showAlertDeleteDtg: boolean = false;
  public showAlertDeleteTg: boolean = false;
  public doctypeForm: FormGroup;

  //Icon System
  icons: OptionsDropdown[] = [];
  iconClass: string = '';

  constructor(
    private doctypegroupService: DoctypegroupService,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private messageService: ToastService,
  ) {

    this.disposition_final = [
      {label: 'Conservación Total', value: 'CT'},
      {label: 'Microfilmación', value: 'M'},
      {label: 'Digitalización', value: 'D'},
      {label: 'Eliminar', value: 'E'},
    ];

    this.typeSupport = [
      {label: 'Electrónico', value: 'E'},
      {label: 'Físico', value: 'F'},
    ];

    this.docTypeGroupForm = this.fb.group({
      name: ['', Validators.required],
    });

    this.format = [
      {label: 'dcs', value: 'dcs'},
      {label: 'frm', value: 'frm'},
      {label: 'wkf', value: 'wkf'},
      {label: 'tif', value: 'tif'},
      {label: 'jpg', value: 'jpg'},
      {label: 'png', value: 'png'},
      {label: 'pdf', value: 'pdf'},
      {label: 'doc', value: 'doc'},
      {label: 'sys', value: 'sys'},
      {label: 'dsb', value: 'dsb'},
      {label: 'vsr', value: 'vsr'},
      {label: 'tpl', value: 'tpl'},
      {label: 'rpt', value: 'rpt'},
    ];

    this.doctypeForm = this.fb.group(
      {
        code: ['', [Validators.required, this.lessCode]],
        name: ['', Validators.required],
        url_path: [''],
        storage_id: ['', Validators.required],
        format: ['', Validators.required],
        tipo_soporte: ['', Validators.required],
        retencion_electronic: ['', Validators.required],
        retencion_ag: ['', Validators.required],
        retencion_ac: ['', Validators.required],
        retencion_ah: ['', Validators.required],
        final_disposition: ['', Validators.required],
        digitalizacion: ['', Validators.required],
        procedure: [''],
        class: ['', Validators.required],
        is_cipher: [''],
      },
      {
        validators: this.lessCode('code'),
      },
    );
  }

  ngOnInit(): void {
    this.project = JSON.parse(sessionStorage.getItem('project') || '');
    this.client = JSON.parse(sessionStorage.getItem('client') || '');
    this.getDoctypeGroups();
    this.valueCode();
    this.store.select('doctype').subscribe(({doctypeGroups, doctypeGroup}) => {
      this.docTypeGroups = JSON.parse(JSON.stringify(doctypeGroups));
      this.doctypeGruop = doctypeGroup;
      this.valueCode();
    });

    this.columnsDocTypes = [
      {field: 'code', header: 'Código'},
      {field: 'name', header: 'Nombre'},
      {field: 'url_path', header: 'URL'},
      {field: 'format', header: 'Formato'},
    ];

    // ICON SYSTEM
    this.icons = IconsMaterial;

    this.getStorage();
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  private getDoctypeGroups(): void {
    this.isBlockPage = true;
    this._subscription.add(
      this.doctypegroupService.getDoctypeGroupsByProjectID(this.project.id.toLowerCase()).subscribe({
        next: (res) => {
          if (res.error) {
            this.messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            this.store.dispatch(controlDoctypegroups({doctypegroups: res.data}));
          }
          this.isBlockPage = false;
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.isBlockPage = false;
        }
      })
    );
  }

  public selectedDocTypeGroup(doctypegroup: DocTypeGroups): void {
    this.doctypeGruop = doctypegroup;
    this.docTypeGroupSelected = doctypegroup;
    if (this.docTypeGroupSelected.doctypes) {
      this.docTypesDisplay = [];
      for (const item of this.docTypeGroupSelected.doctypes) {
        this.docTypesDisplay.push({active: false, docType: item});
      }
    }
    this.view = 'docTypesList';
  }

  showAddDocTypeGroups(): void {
    this.isShowDoctypegroup = true;
    this.store.dispatch(showDoctypegroup({operation: 'add'}));
  }

  public editDocTypeGroups(docTypeGroup: DocTypeGroups): void {
    this.isShowDoctypegroup = true;
    //this.docTypeGroupForm.get('docTypeGroup')?.setValue(docTypeGroup.name);
    this.docTypeGroupForm.patchValue({
      name: docTypeGroup.name
    });
    this.view = 'docTypesGroupEdit';
    // this.store.dispatch(showDoctypegroup({operation: 'edit'}));
    /*this.cancelAutoname();
    this.cancelDoctype();
    this.cancelDoctypeEntity();*/
  }

  showAddDocType() {
    this.view = 'doctypeCreate';
    // this.store.dispatch(controlDoctypes({docType: {}, indexDocType: 0, operation: 'add'}));
  }

  private valueCode(): void {
    this.isBlockPage = true;
    this._subscription.add(
      this.doctypegroupService.getMaxCodDoctype().subscribe({
        next: (res) => {
          if (res.error) {
            this.messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            this.messageService.add({type: 'success', message: res.msg, life: 5000});
            this.valorCode = res.data;
          }
          this.isBlockPage = false;
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.isBlockPage = false;
          this.messageService.add({type: 'error', message: err.error.msg, life: 5000});
        }
      })
    );
  }

  showOptions(event: any, option: any, rowData: any, indexDocType: number): void {
    this.autoName = rowData;
    this.docEntity = rowData;
    this.indexAutoname = indexDocType;
    // this.store.dispatch(controlDoctypes({ doctype: rowData, indexDocType, operation: 'edit' }));
    event.preventDefault();
    event.stopPropagation();
    option.show(event);
  }

  private createDoctypeGroups(doctypegroup: DocTypeGroups): void {
    this.isShowDoctypegroup = false;
    const dtgRedux = {
      id: doctypegroup.id,
      name: doctypegroup.name,
      project: doctypegroup.project_id || ''
    };
    this._subscription.add(
      this.doctypegroupService.createDoctypeGroup(doctypegroup).subscribe({
        next: (res) => {
          if (res.error) {
            this.messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            this.messageService.add({type: 'success', message: res.msg, life: 5000});
            this.view = 'docTypesGroup';
            this.docTypeGroups.push(doctypegroup);
            // this.store.dispatch(addDoctypegroup({doctypegroup: dtgRedux as DocTypeGroups}));
          }
          this.isBlockPage = false;
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.messageService.add({type: 'error', message: err.error.msg, life: 5000});
          this.isBlockPage = false;
        }
      })
    );
  }

  private updateDoctypeGroups(doctypegroup: DocTypeGroups): void {
    this.isShowDoctypegroup = false;
    const data = JSON.parse(JSON.stringify(doctypegroup));
    delete data.project;
    delete data.doctypes;
    delete data.is_update;
    this.isBlockPage = true;
    this._subscription.add(
      this.doctypegroupService.updateDoctypeGroup(data).subscribe({
        next: (res) => {
          if (res.error) {
            this.messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            this.messageService.add({type: 'success', message: res.msg, life: 5000});
            this.view = 'docTypesGroup';
            const indexDtg = this.docTypeGroups.findIndex(dtg => dtg.id === doctypegroup.id);
            if (indexDtg !== -1) {
              this.docTypeGroups[indexDtg] = doctypegroup;
            }
            // this.store.dispatch(editDoctypegroup({doctypegroup: doctypegroup}));
          }
          this.isBlockPage = false;
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.isBlockPage = false;
          this.messageService.add({type: 'error', message: err.message, life: 5000});
        }
      })
    );
  }

  public confirmDeleteDoctypeGroups(event: boolean): void {
    if (event) {
      this.deleteDoctypeGroups();
    } else {
      this.showAlertDeleteDtg = false;
    }
  }

  public confirmDeleteDoctype(event: boolean): void {
    if (event) {
      if (!this.docTypeSelected.doctypes_entities || this.docTypeSelected.doctypes_entities.length === 0) {
        this.deleteDocType();
      } else {
        this.showAlertDeleteTg = false;
        this.messageService.add({
          type: 'warning',
          message: 'No se puede eliminar el tipo de documento porque tiene entidades asociadas',
          life: 5000
        });
      }
    } else {
      this.showAlertDeleteTg = false;
    }
  }

  private deleteDoctypeGroups(): void {
    const id = this.doctypeGruop.id?.toLocaleLowerCase() || '';
    const data = this.doctypeGruop;
    if (data.doctypes && data.doctypes.length > 0) {
      this.messageService.add({
        type: 'warning',
        message: 'El Grupo Documental no se puede eliminar debido a que tiene Tipos Documentales Asociados',
        life: 5000
      });
    } else {
      this.isBlockPage = true;
      this._subscription.add(
        this.doctypegroupService.deleteDoctypeGroup(id).subscribe({
          next: (res) => {
            if (res.error) {
              this.messageService.add({type: 'error', message: res.msg, life: 5000});
            } else {
              this.messageService.add({type: 'success', message: res.msg, life: 5000});
              this.doctypeGruop = {};
              this._subscription.add(
                this.doctypegroupService.getDoctypeGroupsProject().subscribe({
                  next: (resp) => {
                    if (resp.error) {
                      this.messageService.add({type: 'error', message: res.msg, life: 5000});
                    } else {
                      this.store.dispatch(controlDoctypegroups({doctypegroups: resp.data}));
                    }
                  },
                  error: (err: HttpErrorResponse) => {
                    console.error(err);
                    this.messageService.add({type: 'error', message: err.message, life: 5000});
                  }
                })
              );
            }
            this.isBlockPage = false;
          },
          error: (err: HttpErrorResponse) => {
            this.isBlockPage = false;
            console.error(err);
            this.messageService.add({type: 'error', message: err.message, life: 5000});
          }
        })
      );
    }
  }

  private deleteDocType(): void {
    this.isBlockPage = true;
    this._subscription.add(
      this.doctypegroupService.deleteDoctype(this.docTypeSelected.id || '').subscribe({
        next: (res) => {
          if (res.error) {
            this.messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            this.messageService.add({type: 'success', message: res.msg, life: 5000});
            this.docTypeGroupSelected.doctypes = this.docTypeGroupSelected.doctypes?.filter(d => d.id !== this.docTypeSelected.id);
            this.docTypesDisplay = this.docTypesDisplay?.filter(d => d.docType.id !== this.docTypeSelected.id);
            const index = this.docTypes.findIndex(d => d.id === this.docTypeSelected.id);
            if (index !== -1) {
              this.docTypes[index] = this.docTypeSelected;
            }
            this.docTypeSelected = {};
          }
          this.isBlockPage = false;
        },
        error: (err: HttpErrorResponse) => {
          this.isBlockPage = false;
          console.error(err);
          this.messageService.add({type: 'error', message: err.message, life: 5000});
        }
      })
    );
  }

  public createDoctype(doctype: DocTypes): void {
    const doctypePersistence = JSON.parse(JSON.stringify(doctype));
    delete doctypePersistence.doctypes_entities;
    this.isBlockPage = true;
    this._subscription.add(
      this.doctypegroupService.createDoctype(doctypePersistence).subscribe({
        next: (res) => {
          if (res.error) {
            this.messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            this.view = 'doctypes';
            this.messageService.add({type: 'success', message: res.msg, life: 5000});
            this.docTypeGroupSelected.doctypes?.push(doctype);
            const docTypeGroupIndex = this.docTypeGroups.findIndex((dtg) => dtg.id === this.docTypeGroupSelected.id);
            if (docTypeGroupIndex > -1) {
              this.docTypeGroups[docTypeGroupIndex].doctypes = this.docTypeGroupSelected.doctypes;
            }
          }
          this.isBlockPage = false;
        },
        error: (err: HttpErrorResponse) => {
          this.isBlockPage = false;
          console.error(err);
          this.messageService.add({type: 'error', message: err.message, life: 5000});
        }
      })
    );
  }

  public updateDoctype(doctype: DocTypes): void {
    this.isShowAddAutoname = false;
    const data = doctype;
    delete data.doctypes_entities;
    this.isBlockPage = true;
    this._subscription.add(
      this.doctypegroupService.updateDoctype(data).subscribe({
        next: (res) => {
          if (res.error) {
            this.messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            this.view = 'doctypes';
            this.messageService.add({type: 'success', message: res.msg, life: 5000});
            const docTypeIndex = this.docTypeGroupSelected.doctypes?.findIndex((dtg) => dtg.id === doctype.id);
            if (docTypeIndex && docTypeIndex > -1) {
              // @ts-ignore
              this.docTypeGroupSelected.doctypes[docTypeIndex] = doctype;
            }
            const docTypeGroupIndex = this.docTypeGroups.findIndex((dtg) => dtg.id === this.docTypeGroupSelected.id);
            if (docTypeGroupIndex > -1) {
              this.docTypeGroups[docTypeGroupIndex].doctypes = this.docTypeGroupSelected.doctypes;
            }
            const index = this.docTypesDisplay.findIndex((item) => item.docType.id === doctype.id);
            if (index !== -1) {
              this.docTypesDisplay[index].docType = doctype;
            }
          }
          this.isBlockPage = false;
        },
        error: (err: HttpErrorResponse) => {
          this.isBlockPage = false;
          console.error(err);
          this.messageService.add({message: err.message, type: 'error', life: 5000});
        }
      })
    );
  }

  public saveDocTypeGroups(): void {
    if (this.docTypeGroupForm.invalid) {
      this.messageService.add({
        type: 'warning',
        message: 'Complete correctamete todos los campos del formulario',
        life: 5000
      });
      this.docTypeGroupForm.markAllAsTouched();
    } else {
      if (this.view === 'edit') {
        const doctypeGroup: DocTypeGroups = {
          ...this.docTypeGroups,
          ...this.docTypeGroupForm.value,
          id: this.docTypeGroupSelected.id?.toLocaleLowerCase(),
          project_id: this.docTypeGroupSelected.project?.id.toLocaleLowerCase(),
        };
        this.updateDoctypeGroups(doctypeGroup);
      } else {
        const doctypeGroup: DocTypeGroups = {
          ...this.docTypeGroupForm.value,
          id: uuidv4().toLowerCase(),
          project_id: this.project.id.toLocaleLowerCase(),
        };
        this.createDoctypeGroups(doctypeGroup);
      }
    }
  }

  public showConfigMenu(index: number): void {
    this.docTypesDisplay = this.docTypesDisplay.map((doc, i) => {
      if (i === index) {
        doc.active = true;
        return doc;
      } else {
        doc.active = false;
        return doc;
      }
    });
  }

  public editDocType(docType: DocTypes): void {
    this.docTypeSelected = docType;
    this.view = 'doctypeEdit';
    this.doctypeForm.patchValue({
      code: docType.code,
      name: docType.name,
      url_path: docType.url_path,
      storage_id: docType.storage_id,
      format: docType.format,
      tipo_soporte: docType.tipo_soporte,
      retencion_electronic: docType.retencion_electronic,
      retencion_ag: docType.retencion_ag,
      retencion_ac: docType.retencion_ac,
      retencion_ah: docType.retencion_ah,
      final_disposition: docType.final_disposition,
      digitalizacion: docType.digitalizacion,
      procedure: docType.procedure,
      class: docType.class,
      is_cipher: docType.is_cipher
    });
  }

  public lessCode(numCode: string) {
    return (formGroup: FormGroup) => {
      const min = 100;
      const lim = 1000;
      const max = formGroup.controls[numCode];
      if (max && min <= max.value && lim > max.value) {
        max.setErrors(null);
      } else {
        max.setErrors({leesCode: true});
      }
    };
  }

  public getStorage(): void {
    this.doctypegroupService.getStorage().subscribe({
      next: (res) => {
        if (res.error) {
          this.messageService.add({type: 'error', message: res.msg, life: 5000});
        } else {
          for (const data of res.data) {
            this.storages = [{label: data.name, value: data.id.toLocaleLowerCase()}];
          }
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.messageService.add({message: err.message, type: 'error', life: 5000});
      }
    });
  }

  public selectTyeConfig(type: string, docType: DocTypes): void {
    this.view = type;
    this.docTypeSelected = docType;
    this.docTypesDisplay = this.docTypesDisplay.map((doc) => ({...doc, active: false}));
  }

  public saveDoctype(): void {
    if (this.doctypeForm.invalid) {
      this.doctypeForm.markAllAsTouched();
      this.messageService.add({
        type: 'warning',
        message: 'Complete correctamete todos los campos del formulario',
        life: 5000
      });
    } else {
      if (this.view === 'doctypeEdit') {
        const docTypes: DocTypes = {
          ...this.docTypeSelected,
          ...this.doctypeForm.value,
          id: this.docTypeSelected.id?.toLocaleLowerCase(),
          doctypes_groups_id: this.docTypeSelected.doctypes_groups_id?.toLocaleLowerCase(),
        };
        if (docTypes.format !== 'frm' && docTypes.format !== 'dsb' && docTypes.format !== 'rpt') {
          docTypes.procedure = '';
          docTypes.url_path = '';
        } else if (docTypes.format === 'dsb' || docTypes.format === 'rpt') {
          docTypes.url_path = '';
        }
        this.updateDoctype(docTypes);
      } else {
        const doctype: DocTypes = {
          ...this.doctypeForm.value,
          id: uuidv4().toLowerCase(),
          doctypes_groups_id: this.docTypeGroupSelected.id?.toLocaleLowerCase(),
          autoname: '',
        };
        if (doctype.format !== 'frm' && doctype.format !== 'dsb' && doctype.format !== 'rpt') {
          doctype.procedure = '';
          doctype.url_path = '';
        } else if (doctype.format === 'dsb' || doctype.format === 'rpt') {
          doctype.url_path = '';
        }
        this.createDoctype(doctype);
      }
    }
  }

}
