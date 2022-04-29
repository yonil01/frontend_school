import {Component, OnInit} from '@angular/core';
import {Customer, DocTypeGroups, DocTypes, Project, Response} from "@app/core/models";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AnnexeRequestModel, Required} from "@app/core/models/config/annexe";
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


interface AnnexDoc {
  name: string,
  version: number,
  isActive: boolean,
  selected: boolean
}

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
  public isEdit = false;
  public isConfig = true;
  public isTab1 = true;

  public showOnlyCheckedTab1 = false;
  public showOnlyCheckedTab2 = false;

  public formAnnexe!: FormGroup;

  public doctype!: DocTypes;
  public doctypeAll: DocTypes[] = [];
  public annexesAll!: Required[];

  public annexeDisplay!: number;
  public showConfirm = false;

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

  public addedAnnexe() {
    if (this.formAnnexe.valid) {
      const annexe: AnnexeRequestModel = {
        id: uuidv4().toLowerCase(),
        name: this.formAnnexe.get('name')?.value,
        version: this.formAnnexe.get('version')?.value,
        is_active: this.formAnnexe.get('is_active')?.value,
        doctype_id: this.doctype.id?.toString() || ''
      }
      this._annexeService.createRequired(annexe).subscribe({
        next: (res: any) => {
          if (res.error) {
            this._messageService.add({type: 'error', message: res.msg, life: 5000})
          } else {
            this.formAnnexe.reset({name: '', version: '', is_active: false});
            this._messageService.add({type: 'success', message: 'Anexo creado con éxito', life: 5000})
          }
        },
        error: () => {
          this._messageService.add({type: 'error', message: 'Conexión perdida con el servidor', life: 5000})
        }
      })
    } else {
      this.formAnnexe.markAllAsTouched();
    }
  }

  public onlyNumbers = {}

  public confirmDeleteAnnexe(isConfirm: boolean): void {
    if (isConfirm) {
      if (!this.annexeSelected.required_doctypes) {
        this.deleteAnnexe();
      } else {
        this.showConfirm = false;
        this._messageService.add({
          type: 'warning',
          message: 'No se puede eliminar el tipo de documento porque tiene entidades asociadas',
          life: 5000
        });
      }
    } else {
      this.showConfirm = false;
    }
  }

  private updateAnnexe() {
    this._annexeService.deleteRequired(this.annexeSelected.id).subscribe({
      next: (res: Response) => {
        if (res.error) {
          this._messageService.add({type: 'error', message: res.msg, life: 5000});
        } else {
          this._messageService.add({type: 'succes', message: 'Annexo borrado correctamente!', life: 5000});
          this.annexesAll = this.annexesAll.filter((annexe) => annexe.id !== this.annexeSelected.id);
          this.annexeSelected = {} as Required;
        }
        this.showConfirm = false;
      },
      error: () => {
        this._messageService.add({type: 'error', message: 'Conexión perdida con el servidor!', life: 5000});
      }
    })
  }

  private deleteAnnexe() {
    this._annexeService.deleteRequired(this.annexeSelected.id).subscribe({
      next: (res: Response) => {
        if (res.error) {
          this._messageService.add({type: 'error', message: res.msg, life: 5000});
        } else {
          this._messageService.add({type: 'succes', message: 'Annexo borrado correctamente!', life: 5000});
          this.annexesAll = this.annexesAll.filter((annexe) => annexe.id !== this.annexeSelected.id);
          this.annexeSelected = {} as Required;
        }
        this.showConfirm = false;
      },
      error: () => {
        this._messageService.add({type: 'error', message: 'Conexión perdida con el servidor!', life: 5000});
      }
    })
  }

}
