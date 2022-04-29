import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  DocTypeGroups,
  DocTypes,
  DocTypesDisplay,
  Project
} from "@app/core/models";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Store} from "@ngrx/store";
import {AppState} from "@app/core/store/app.reducers";
import {ToastService} from "ecapture-ng-ui";
import {controlDoctypegroups,} from "@app/core/store/actions/doctype.action";
import {DoctypegroupService} from "@app/modules/wizard/services/doctypegroup/doctypegroup.service";
import {Subscription} from "rxjs/internal/Subscription";
import {HttpErrorResponse} from "@angular/common/http";
import {v4 as uuidv4} from 'uuid';
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {DropdownModel} from "ecapture-ng-ui/lib/modules/dropdown/models/dropdown";
import {dropStyle} from "@app/core/models/dropdown/dropdown";
import {dispositionFinal, formatsDocs, typeSupport} from "@app/core/utils/constants/constant";
import {IconsMaterial} from '@app/core/constants/icons/material-icons';

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
  public typeSupport: { label: string, value: string }[] = typeSupport;
  public format: { label: string, value: string }[] = formatsDocs;
  public disposition_final: { label: string, value: string }[] = dispositionFinal;
  public docTypeGroupForm: FormGroup;
  private project: Project = {
    customers_id: "",
    department: "",
    description: "",
    email: "",
    id: "",
    name: "",
    phone: "",
    product_owner: ""
  };
  private valorCode: string = '';

  public view: string = 'docTypesGroup';
  public showAlertDeleteDtg: boolean = false;
  public showAlertDeleteTg: boolean = false;
  public doctypeForm: FormGroup;

  public icons: OptionsDropdown[] = [];

  constructor(
    private doctypegroupService: DoctypegroupService,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private messageService: ToastService,
  ) {

    this.docTypeGroupForm = this.fb.group({
      name: ['', Validators.required],
    });

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
        digitalizacion: [false, Validators.required],
        procedure: [''],
        class: ['', Validators.required],
        is_cipher: [false],
      },
      {
        validators: this.lessCode('code'),
      },
    );
    this.doctypeForm.get('code')?.disable();
  }

  ngOnInit(): void {
    this.project = JSON.parse(sessionStorage.getItem('project') || '');
    this.getDoctypeGroups();
    this.valueCode();
    this.store.select('doctype').subscribe(({doctypeGroups, doctypeGroup}) => {
      this.docTypeGroups = JSON.parse(JSON.stringify(doctypeGroups));
      this.valueCode();
    });

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
          this.messageService.add({
            type: 'error',
            message: 'No se ha podido cargar los grupos documentales! code 103',
            life: 5000
          });
          this.isBlockPage = false;
        }
      })
    );
  }

  public selectedDocTypeGroup(doctypegroup: DocTypeGroups): void {
    this.docTypeGroupSelected = doctypegroup;
    if (this.docTypeGroupSelected.doctypes) {
      this.docTypesDisplay = [];
      for (const item of this.docTypeGroupSelected.doctypes) {
        this.docTypesDisplay.push({active: false, docType: item});
      }
    }
    this.view = 'docTypesList';
  }

  public editDocTypeGroups(docTypeGroup: DocTypeGroups): void {
    this.docTypeGroupForm.patchValue({
      name: docTypeGroup.name
    });
    this.docTypeGroupSelected = docTypeGroup;
    this.view = 'docTypesGroupEdit';
  }

  public showAddDocType(): void {
    this.view = 'doctypeCreate';
    this.doctypeForm.get('code')?.enable();
    /*if (this.docTypeGroupSelected.doctypes && this.docTypeGroupSelected.doctypes?.length) {
      const code = this.docTypeGroupSelected.doctypes[this.docTypeGroupSelected.doctypes.length - 1].code || 0;
      this.doctypeForm.get('code')?.setValue(code);
    }*/
  }

  private valueCode(): void {
    this.isBlockPage = true;
    this._subscription.add(
      this.doctypegroupService.getMaxCodDoctype().subscribe({
        next: (res) => {
          if (res.error) {
            this.messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            this.valorCode = res.data;
            this.doctypeForm.get('code')?.setValue(this.valorCode);
          }
          this.isBlockPage = false;
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.isBlockPage = false;
          this.messageService.add({
            type: 'error',
            message: 'No se ha podido traer el codigo del tipo documental',
            life: 5000
          });
        }
      })
    );
  }

  private createDoctypeGroups(doctypegroup: DocTypeGroups): void {
    this._subscription.add(
      this.doctypegroupService.createDoctypeGroup(doctypegroup).subscribe({
        next: (res) => {
          if (res.error) {
            this.messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            this.messageService.add({type: 'success', message: res.msg, life: 5000});
            this.view = 'docTypesGroup';
            this.docTypeGroups.push(doctypegroup);
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
      this.docTypeGroupSelected = {};
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
    const id = this.docTypeGroupSelected.id?.toLocaleLowerCase() || '';
    const data = this.docTypeGroupSelected;
    this.showAlertDeleteDtg = false;
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
              this._subscription.add(
                this.doctypegroupService.getDoctypeGroupsByProjectID(this.project.id.toLowerCase()).subscribe({
                  next: (resp) => {
                    if (resp.error) {
                      this.messageService.add({type: 'error', message: res.msg, life: 5000});
                    } else {
                      this.store.dispatch(controlDoctypegroups({doctypegroups: resp.data}));
                    }
                    this.docTypeGroupSelected = {};
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
    this.showAlertDeleteTg = false;
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
            this.docTypeSelected = {};
            this.valueCode();
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
            this.view = 'docTypesList';
            this.messageService.add({type: 'success', message: res.msg, life: 5000});
            this.docTypeGroupSelected.doctypes?.push(doctype);
            const docTypeGroupIndex = this.docTypeGroups.findIndex((dtg) => dtg.id === this.docTypeGroupSelected.id);
            if (docTypeGroupIndex > -1) {
              this.docTypeGroups[docTypeGroupIndex].doctypes = this.docTypeGroupSelected.doctypes;
            }
            this.doctypeForm.reset();
            this.docTypesDisplay.push({active: false, docType: doctype});
            this.valueCode();
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
    const data = doctype;
    delete data.doctypes_entities;
    this.isBlockPage = true;
    this._subscription.add(
      this.doctypegroupService.updateDoctype(data).subscribe({
        next: (res) => {
          if (res.error) {
            this.messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            this.view = 'docTypesList';
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
            this.doctypeForm.reset();
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
      if (this.view === 'docTypesGroupEdit') {
        const doctypeGroup: DocTypeGroups = {
          ...this.docTypeGroupForm.value,
          id: this.docTypeGroupSelected.id?.toLocaleLowerCase(),
          project_id: this.project?.id.toLocaleLowerCase(),
        };
        this.updateDoctypeGroups(doctypeGroup);
      } else {
        const doctypeGroup: DocTypeGroups = {
          ...this.docTypeGroupForm.value,
          id: uuidv4().toLowerCase(),
          project_id: this.project.id.toLocaleLowerCase(),
        };
        this.isBlockPage = true;
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
          code: this.doctypeForm.get('code')?.value,
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
          code: this.doctypeForm.get('code')?.value,
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
