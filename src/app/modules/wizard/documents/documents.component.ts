import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  Attribute,
  Customer,
  DoctypeEntities,
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
  addDoctype,
  addDoctypegroup,
  controlDoctype,
  controlDoctypegroup,
  controlDoctypegroups,
  controlDoctypes, deleteDocType, editDoctype, editDoctypegroup, editEntity,
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
  public docTypeGroupSelected!: DocTypeGroups;
  public docTypesDisplay: DocTypesDisplay[] = [];
  public docTypeSelected!: DocTypes;
  public storages: any[] = [];
  public typeSupport: any[] = [];
  public format: any[] = [];
  public disposition_final: any[] = [];
  docTypes: DocTypes[] = [];
  docTypeGroupForm: FormGroup;
  doctypeGruop!: DocTypeGroups;
  autoName: DocTypes = {};
  docEntity: DocTypes = {};
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
  items: any[] = [];
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

  // isShowEditEntity: boolean;

  columnsDocTypes: any[] = [];
  public view: string = 'docTypesGroup';
  public showAlertDeleteDtg: boolean = false;
  public doctypeForm: FormGroup;

  constructor(
    private doctypegroupService: DoctypegroupService,
    private fb: FormBuilder,
    private store: Store<AppState>,
    // private confirmationService: ConfirmationService,
    private messageService: ToastService,
  ) {

    this.disposition_final = [
      { label: 'Conservación Total', value: 'CT' },
      { label: 'Microfilmación', value: 'M' },
      { label: 'Digitalización', value: 'D' },
      { label: 'Eliminar', value: 'E' },
    ];

    this.typeSupport = [
      { label: 'Electrónico', value: 'E' },
      { label: 'Físico', value: 'F' },
    ];

    this.docTypeGroupForm = this.fb.group({
      name: ['', Validators.required],
    });

    this.format = [
      { label: 'dcs', value: 'dcs' },
      { label: 'frm', value: 'frm' },
      { label: 'wkf', value: 'wkf' },
      { label: 'tif', value: 'tif' },
      { label: 'jpg', value: 'jpg' },
      { label: 'png', value: 'png' },
      { label: 'pdf', value: 'pdf' },
      { label: 'doc', value: 'doc' },
      { label: 'sys', value: 'sys' },
      { label: 'dsb', value: 'dsb' },
      { label: 'vsr', value: 'vsr' },
      { label: 'tpl', value: 'tpl' },
      { label: 'rpt', value: 'rpt' },
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

    this.items = [
      {label: 'Autoname', icon: 'pi pi-pencil', command: () => this.showAddAutoname()},
      {separator: true},
      {label: 'Entidades', icon: 'pi pi-pencil', command: () => this.showEditEntity()},
      {separator: true},
    ];
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
      for (const item of this.docTypeGroupSelected.doctypes) {
        this.docTypesDisplay.push({active: false, docType: item});
      }
    }
    const index = this.docTypeGroups.indexOf(doctypegroup);
    // this.store.dispatch(controlDoctypegroup({doctypegroup, index}));
    this.view = 'docTypesList';
    // this.indexDelete = doctypegroup.id;
  }

  showAddDocTypeGroups(): void {
    this.isShowDoctypegroup = true;
    this.store.dispatch(showDoctypegroup({operation: 'add'}));
  }

  public editDocTypeGroups(docTypeGroup: DocTypeGroups): void {
    this.isShowDoctypegroup = true;
    this.docTypeGroupForm.get('docTypeGroup')?.setValue(docTypeGroup.name);
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

  showEditDocType(rowData: DocTypes, indexDocType: number): void {
    this.view = 'doctype';
    this.store.dispatch(controlDoctypes({docType: rowData, indexDocType, operation: 'edit'}));
    // this.isShowAddDocType = true;
  }

  private showAddAutoname(): void {
    this.view = 'autoname';
    this.store.dispatch(controlDoctype({docType: this.autoName, indexDocType: this.indexAutoname}));
    // this.isShowAddAutoname = true;
  }

  private showEditEntity(): void {
    // this.store.dispatch(controlDoctypes({ docType: this.docEntity, indexDocType: this.indexAutoname , operation: 'edit' }));
    this.store.dispatch(controlDoctype({docType: this.docEntity, indexDocType: this.indexAutoname}));
    // this.isShowEditEntity = true;
    this.view = 'docEntity';
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

  private notifyUser(severity: string, summary: string, detail: string, life: number): void {
    this.messageService.add({
      type: severity,
      message: detail,
      life: life,
    });
  }

  public confirmDeleteDoctypeGroups(event: boolean): void {
    if (event) {
      this.deleteDoctypeGroups();
    } else {
      this.showAlertDeleteDtg = false;
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

  deleteDocType(rowData: DocTypes, index: number): void {
    const idDoctype = rowData.id?.toLocaleLowerCase();
    if (rowData.doctypes_entities) {
      this.notifyUser('error', 'El tipo documental tiene asignado Entidades', '', 4000);
    } else {
      /*this.confirmationService.confirm({
        message: '¿Está seguro de Eliminar el Tipo Documental?',
        header: 'Confimar Eliminación Tipo Documental',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.doctypegroupService.deleteDoctype(idDoctype).subscribe((res) => {
            if (res.error) {
              this.notifyUser('error', 'Error en la Eliminación', res.msg, 5000);
            } else {
              this.view = 'doctypes';
              this.notifyUser('success', 'Eliminación Exitosa', res.msg, 5000);
              this.store.dispatch(deleteDocType({indexDocType: index}));
            }
          });
        },
        reject: () => {
        },
      });*/
    }
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
            this.store.dispatch(addDoctype({doctype: {...doctype}}));
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

  private updateDoctype(doctype: DocTypes): void {
    this.isShowAddAutoname = false;
    const data = JSON.parse(JSON.stringify(doctype));
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
            this.store.dispatch(editDoctype({doctype: doctype}));
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

  createDoctypeEntities(doctypeEntitieRedux: DoctypeEntities[]) {
    this.isShowEditEntity = false;
    this.store.dispatch(editEntity({docEntity: doctypeEntitieRedux, indexDocType: 0}));
  }

  cancelDoctype(): void {
    this.view = 'doctypes';
  }

  cancelDoctypeEntity(): void {
    this.view = 'doctypes';
  }

  cancelAutoname(): void {
    this.view = 'doctypes';
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
        } else  {
          for (const data of res.data) {
            this.storages = [{ label: data.name, value: data.id.toLocaleLowerCase() }];
          }
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.messageService.add({message: err.message, type: 'error', life: 5000});
      }
    });
  }

}
