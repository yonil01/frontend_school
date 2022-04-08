import {Component, OnInit} from '@angular/core';
import {
  addDatedisallowed,
  controlDatedisallowed,
  deleteDatedisallowed,
  updateDatedisallowed
} from "@app/core/store/actions/roles.action";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DateDisallowed, Role, Response} from "@app/core/models";
import {Store} from "@ngrx/store";
import {AppState} from "@app/core/store/app.reducers";
import {Router} from "@angular/router";
import {RoleService} from "@app/modules/wizard/services/roles/role.service";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {ToastService} from "ecapture-ng-ui";
import {v4 as uuidv4} from 'uuid';
import {DatePipe, formatDate} from "@angular/common";

interface FechasDisall {
  begins_at: Date;
  ends_at: Date;
  description: string;
  idDate: string;
  idRol: string;
}

@Component({
  selector: 'app-roles-disabled-dates',
  templateUrl: './roles-disabled-dates.component.html',
  styleUrls: ['./roles-disabled-dates.component.scss']
})
export class RolesDisabledDatesComponent implements OnInit {

  public readonly toastStyle: ToastStyleModel = toastDataStyle;
  public isBlockPage: boolean = false;
  public isEdit: boolean = false;
  public showConfirmDelete: boolean = false;

  DocumentsFechasForm: FormGroup;

  public fechas: DateDisallowed[] = [];
  OpcFechas: DateDisallowed = this.fechas[0];
  indexDate = 0;

  public role: Role = {};

  constructor(
    private formBulder: FormBuilder,
    private store: Store<AppState>,
    private router: Router,
    private _roleService: RoleService,
    private _messageService: ToastService,
    public datepipeFormat: DatePipe
  ) {
    this.DocumentsFechasForm = this.formBulder.group({
      begins_at: ['', [Validators.required]],
      ends_at: ['', [Validators.required]],
      description: [''],
      id: [''],
      role_id: [''],
    });

  }

  ngOnInit(): void {
    this.isBlockPage = true;
    this.store.select('role').subscribe((res) => {
      this.role = res.role;
      if (!this.role || Object.keys(this.role).length === 0) this.router.navigateByUrl('wizard/roles');
      this.fechas = [];
      this.isBlockPage = false;
    });
    this.initFechas();
  }

  initFechas(): void {
    this.store.select('role').subscribe((res) => {
      if (this.role.date_disallowed) {
        for (let item of this.role.date_disallowed) {
          const fechaIFNS = item.begins_at;
          const fechaFFNS = item.ends_at;
          const description = item.description;
          const idDate = item.id;
          const idRol = item.role_id;
          this.fechas.push({
            begins_at: fechaIFNS,
            ends_at: fechaFFNS,
            description: description,
            id: idDate,
            role_id: idRol,
          });
        }
      }
      this.isBlockPage = false;
    });
  }

  saveFechasDeshabilitada(OpcEvent: Event) {
    OpcEvent.preventDefault();
    this.isBlockPage = true;
    if (this.DocumentsFechasForm.invalid) {
      return Object.values(this.DocumentsFechasForm.controls).forEach((control) => {
        control.markAsTouched();
      });
    } else {
      const FechaI = this.DocumentsFechasForm.value.begins_at;
      const FechaF = this.DocumentsFechasForm.value.ends_at;

      if (FechaI <= FechaF) {
        this.DocumentsFechasForm.value.begins_at = this.DocumentsFechasForm.value.begins_at + 'T00:00:01Z';
        this.DocumentsFechasForm.value.ends_at = this.DocumentsFechasForm.value.ends_at + 'T00:00:01Z';
        const dateDisall: DateDisallowed = {
          ...this.DocumentsFechasForm.value,
          id: uuidv4().toLowerCase(),
          role_id: this.role.id?.toLocaleLowerCase(),
        };
        const dataDateD = JSON.parse(JSON.stringify(dateDisall));
        console.log(dataDateD);
        this._roleService.createRolesDateDisallowed(dataDateD).subscribe((res: Response) => {
          if (res.error) {
            this._messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            this.store.dispatch(addDatedisallowed({datedisallowed: dataDateD}));
            this.DocumentsFechasForm.reset();
            this._messageService.add({type: 'success', message: res.msg, life: 5000});
            this.fechas.push({
              begins_at: this.DocumentsFechasForm.value.begins_at,
              ends_at: this.DocumentsFechasForm.value.ends_at,
              description: this.DocumentsFechasForm.value.description,
              id: this.DocumentsFechasForm.value.idDate,
              role_id: this.DocumentsFechasForm.value.idRol,
            });
          }
          this.isBlockPage = false;
        });
      } else {
        this._messageService.add({
          type: 'error',
          message: 'La Fecha Inicial debe ser Menor a la Fecha Final',
          life: 5000
        });
      }
    }
  }

  public OptionTableSet(event: Event, OpcFechas: DateDisallowed, index: number): void {
    event.preventDefault();
    this.indexDate = index;
    this.isEdit = true;
    const ends_at = new Date(OpcFechas.ends_at.toString().replace('T00:00:01Z', ''));
    ends_at.setDate(ends_at.getDate() + 1);
    const begins_at = new Date(OpcFechas.begins_at.toString().replace('T00:00:01Z', ''));
    begins_at.setDate(begins_at.getDate() + 1);
    this.DocumentsFechasForm.patchValue({
      ends_at: formatDate(ends_at, 'yyyy-MM-dd', 'en'),
      begins_at: formatDate(begins_at, 'yyyy-MM-dd', 'en'),
      description: OpcFechas.description,
      id: OpcFechas.id,
      role_id: OpcFechas.role_id,
    });
  }

  OpcionTableDelete(event: Event, OpcFechas: FechasDisall, index: number) {
    /*event.preventDefault();
    this.OpcFechas = OpcFechas;
    this.indexDate = index;
    this.showConfirmDelete = true;*/
  }

  confirmDialogDelete(event: boolean) {
    if (event) {
      const idFecha = this.OpcFechas.id?.toLocaleLowerCase() || '';
      this._roleService.deleteRolesDateDisallowed(idFecha).subscribe((res: Response) => {
        if (res.error) {
          this._messageService.add({type: 'error', message: 'Error en la Eliminación', life: 5000});
        } else {
          this._messageService.add({type: 'success', message: 'Eliminación Exitosa', life: 5000});
          this.fechas.splice(this.indexDate, 1);
          this.store.dispatch(deleteDatedisallowed({index: this.indexDate}));
          this.DocumentsFechasForm.reset();
        }
        this.showConfirmDelete = false;
      });
    } else {
      this.showConfirmDelete = false;
    }
  }


  updateDateDisallowed(event: Event) {
    event.preventDefault();
    // Se actualiza el form en el  this.tableModificacionItem =index;
    const FechaF = this.DocumentsFechasForm.value.ends_at;
    const FechaI = this.DocumentsFechasForm.value.begins_at;
    if (FechaI > FechaF) {
      this._messageService.add({
        type: 'error',
        message: 'La Fecha Inicial debe ser Menor a la Fecha Final',
        life: 5000
      });
    } else {
      if (this.indexDate !== 9999) {
        const id_Date = this.fechas[this.indexDate].id;
        this.DocumentsFechasForm.value.begins_at = this.DocumentsFechasForm.value.begins_at + 'T00:00:01Z';
        this.DocumentsFechasForm.value.ends_at = this.DocumentsFechasForm.value.ends_at + 'T00:00:01Z';
        const dateDisall: DateDisallowed = {
          ...this.DocumentsFechasForm.value,
          id: id_Date?.toLocaleLowerCase(),
          role_id: this.role.id?.toLocaleLowerCase(),
        };
        const dataDateD = JSON.parse(JSON.stringify(dateDisall));
        this._roleService.updateRolesDateDisallowed(dataDateD).subscribe((res: Response) => {
          if (res.error) {
            this._messageService.add({type: 'error', message: 'Error en la Actualización', life: 5000});
          } else {
            this._messageService.add({type: 'success', message: 'Actualización Exitosa', life: 5000});
            this.store.dispatch(controlDatedisallowed({index: this.indexDate}));
            this.store.dispatch(updateDatedisallowed({datedisallowed: dataDateD}));

            this.fechas[this.indexDate].begins_at = this.DocumentsFechasForm.value.begins_at;
            this.fechas[this.indexDate].ends_at = this.DocumentsFechasForm.value.ends_at;
            this.fechas[this.indexDate].description = this.DocumentsFechasForm.value.description;
            this.fechas[this.indexDate].id = this.DocumentsFechasForm.value.idDate;
            this.fechas[this.indexDate].role_id = this.DocumentsFechasForm.value.idRol;

            this.isEdit = false;
          }
          this.isBlockPage = false;
        });
      }
      this.DocumentsFechasForm.reset();
    }
  }


}
