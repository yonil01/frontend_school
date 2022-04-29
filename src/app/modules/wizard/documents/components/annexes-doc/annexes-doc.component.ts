import {Component, OnInit} from '@angular/core';
import {Customer, DocTypeGroups, DocTypes, Project, Response} from "@app/core/models";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AnnexeDoctypesRequestModel, AnnexeRequestModel, Required} from "@app/core/models/config/annexe";
import {AnnexeService} from "@app/modules/wizard/documents/services/annexe/annexe.service";
import {State, Store} from "@ngrx/store";
import {AppState} from "@app/core/store/app.reducers";
import {Router} from "@angular/router";
import {v4 as uuidv4} from "uuid";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {ToastService} from "ecapture-ng-ui";
import {DoctypegroupService} from "@app/modules/wizard/services/doctypegroup/doctypegroup.service";
import {ConfirmationService} from "primeng/api";
import {onlyNumbers} from "@app/core/utils/validations/validations";

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
  public isConfig = true;
  public isTab1 = true;

  public showOnlyCheckedTab1 = false;
  public showOnlyCheckedTab2 = false;

  public formAnnexe!: FormGroup;

  public doctype!: DocTypes;
  public doctypeAll: DocTypes[] = [];
  public doctypeConfiguration: { id?: string, name?: string, is_required?: boolean }[] = [];
  public annexesAll!: Required[];

  public annexeDisplayIndex!: number;
  public showConfirm = false;
  public showConfiguration = false;

  public annexeSelected!: Required;
  public isBlockPage = true;

  constructor(private _annexeService: AnnexeService, private _fb: FormBuilder, private store: Store<AppState>,
              private _route: Router, private _messageService: ToastService, private _confirmService: ConfirmationService,
              private _doctypeGroupService: DoctypegroupService) {

    this.store.select('doctype').subscribe((doctypeState) => {

      doctypeState.doctypeGroups.forEach((e) => {
        if (e.doctypes) this.doctypeAll.push(...e.doctypes);
      })

      const {doctype} = doctypeState;
      if ('id' in doctype) {
        this.doctype = {...doctype};
        this.annexesAll = doctype.required || [];
        this.isBlockPage = false;
      } else {
        this._route.navigate(["/wizard/documents"])
      }
    })

    this.project = JSON.parse(sessionStorage.getItem('project') || '');
    this.client = JSON.parse(sessionStorage.getItem('client') || '');
    this.nameClient = this.client.name + '';
    this.nameProject = this.project.name + '';

    this.formAnnexe = this._fb.group({
      name: ['', [Validators.required]],
      version: ['', [Validators.required]],
      is_active: [false, []],
    })

  }

  ngOnInit(): void {
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
            // this.annexesAll.push(res.data);
            this.annexesAll = [...this.annexesAll, res.data];
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
    this.formAnnexe.reset({name: annexe.name, version: annexe.version, is_active: annexe.is_active});
    this.isEditAnnexe = true;
    this.movePositionTop();
  }

  public cancelEdition() {
    this.resetFormAnnexe();
    this.isEditAnnexe = false;
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
      if (!this.annexeSelected.required_doctypes) {
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
    this.showConfiguration = !false;
    if (this.showConfiguration) {
      this.annexeSelected = annexe;
      this.doctypeConfiguration = this.doctypeAll.map((_doctype: DocTypes) => {
        return {
          id: _doctype.id,
          name: _doctype.name,
          is_required: this.isDoctypeRequiredForAnnexe(_doctype)
        }
      })
    } else {
      this.doctypeConfiguration = [];
      this.annexeSelected = {} as Required;
    }
  }

  private isDoctypeRequiredForAnnexe(doctype: DocTypes): boolean {
    let is_required = false;
    const annexe = this.annexesAll.find((_annexe) => _annexe.id === this.annexeSelected.id)
    if (annexe?.required_doctypes) {
      is_required = !!annexe.required_doctypes.find(_doctype => _doctype.id === doctype.id)
    }

    return is_required;
  }

  public createAnnexeRequiredDoctype(doctype: { id?: string, name?: string, is_required?: boolean }) {
    this.isBlockPage = true;
    if (!doctype.is_required) {
      const requiredDoctype: AnnexeDoctypesRequestModel = {
        id: uuidv4().toLowerCase(),
        is_required: true,
        required_id: this.annexeSelected.id,
        // @ts-ignore
        doctype_related_id: doctype.id
      }
      this._annexeService.createRequiredDoctype(requiredDoctype).subscribe({
        next: (res) => {
          if (res.error) {
            this.showMessageError('Error: ' + res.msg);
            doctype.is_required = false;
          } else {
            this.showMessageError('Exito: ' + res.msg);
            doctype.is_required = true;
          }
          this.isBlockPage = false;
        },
        error: (err: Error) => this.showMessageError('Error: ' + err.message)
      })
    } else {
      this.deleteAnnexeRequiredDoctype(doctype);
    }
    return false;
  }

  private deleteAnnexeRequiredDoctype(doctype: { id?: string, name?: string, is_required?: boolean }) {
    this._annexeService.deleteRequiredDoctype('').subscribe({
      next: (res) => {
        if (res.error) {
          this.showMessageError('Error: ' + res.msg);
          doctype.is_required = true;
        } else {
          this.showMessageError('Exito: ' + res.msg);
          doctype.is_required = false;
        }
        this.isBlockPage = false;
      },
      error: (err: Error) => this.showMessageError('Error: ' + err.message)
    })
  }

}
