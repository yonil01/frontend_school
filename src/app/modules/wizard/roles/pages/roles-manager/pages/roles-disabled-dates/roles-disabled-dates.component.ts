import {Component, OnInit} from '@angular/core';
import {addDatedisallowed} from "@app/core/store/actions/roles.action";
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

@Component({
  selector: 'app-roles-disabled-dates',
  templateUrl: './roles-disabled-dates.component.html',
  styleUrls: ['./roles-disabled-dates.component.scss']
})
export class RolesDisabledDatesComponent implements OnInit {

  public readonly toastStyle: ToastStyleModel = toastDataStyle;
  public isBlockPage: boolean = false;

  DocumentsFechasForm: FormGroup;

  public role: Role = {};

  constructor(
    private formBulder: FormBuilder,
    private store: Store<AppState>,
    private router: Router,
    private _roleService: RoleService,
    private _messageService: ToastService,
  ) {
    this.DocumentsFechasForm = this.formBulder.group({
      begins_at: ['', [Validators.required]],
      ends_at: ['', [Validators.required]],
      description: ['', [Validators.required]],
      id: [''],
      role_id: [''],
    });

  }

  ngOnInit(): void {
    this.isBlockPage = true;
    this.store.select('role').subscribe((res) => {
      this.role = res.role;
      if (!this.role || Object.keys(this.role).length === 0) this.router.navigateByUrl('wizard/roles');
      this.isBlockPage = false;
    });
  }

  saveFechasDeshabilitada(OpcEvent: Event) {
    OpcEvent.preventDefault();
    // this.fechas = [];
    if (this.DocumentsFechasForm.invalid) {
      return Object.values(this.DocumentsFechasForm.controls).forEach((control) => {
        control.markAsTouched();
      });
    } else {
      const FechaF = this.DocumentsFechasForm.value.ends_at;
      const FechaI = this.DocumentsFechasForm.value.begins_at;

      if (FechaI <= FechaF) {
        // @ts-ignore
        const dateDisall: DateDisallowed = {...this.DocumentsFechasForm.value, id: uuidv4().toLowerCase(), role_id: this.role.id.toLocaleLowerCase(),};
        const dataDateD = JSON.parse(JSON.stringify(dateDisall));
        this._roleService.createRolesDateDisallowed(dataDateD).subscribe((res: Response) => {
          if (res.error) {

          } else {
            this.store.dispatch(addDatedisallowed({datedisallowed: dataDateD}));
            this.DocumentsFechasForm.reset();
          }
        });
      } else {
      }
    }
  }


}
