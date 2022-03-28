import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Store} from "@ngrx/store";
import {AppState} from "@app/core/store/app.reducers";
import {Role, Response, Customer, Project} from "@app/core/models";
import {Router} from "@angular/router";

import {RoleService} from "@app/modules/wizard/services/roles/role.service";
import {ToastService} from "ecapture-ng-ui";
import {deletePasswordPolicy} from "@app/core/store/actions/roles.action";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";

@Component({
  selector: 'app-roles-security-politic',
  templateUrl: './roles-security-politic.component.html',
  styleUrls: ['./roles-security-politic.component.scss']
})
export class RolesSecurityPoliticComponent implements OnInit {

  public readonly toastStyle: ToastStyleModel = toastDataStyle;
  public isBlockPage: boolean = false;
  public showConfirm: boolean = false;

  public role: Role = {};

  isActive:boolean = false;
  DocumentsPoliticiesForm: FormGroup;

  constructor(
    private formBulder: FormBuilder,
    private store: Store<AppState>,
    private router: Router,
    private _roleService: RoleService,
    private _messageService: ToastService,
  ) {
    this.DocumentsPoliticiesForm = this.formBulder.group({
      enable: ['', [Validators.required]],
      min_length: ['', [Validators.required, Validators.min(1), Validators.max(50)]],
      max_length: ['', [Validators.required, Validators.min(1), Validators.max(50)]],
      time_unlock: ['', [Validators.required, Validators.min(1), Validators.max(1000)]],
      store_pass_not_repeated: ['', [Validators.required, Validators.max(1000)]],
      days_pass_valid: ['', [Validators.required, Validators.max(50)]],
      failed_attempts: ['', [Validators.required, Validators.max(50)]],
      inactivity_time: ['', [Validators.required, Validators.max(1000)]],
      alpha: ['', [Validators.required, Validators.min(0), Validators.max(50)]],
      special: ['', [Validators.required, Validators.min(0), Validators.max(50)]],
      lower_case: ['', [Validators.required, Validators.min(0), Validators.max(50)]],
      upper_case: ['', [Validators.required, Validators.min(0), Validators.max(50)]],
      digits: ['', [Validators.required, Validators.min(0), Validators.max(50)]],
      timeout: ['', [Validators.required, Validators.max(1000)]],
    });
    this.store.select('role').subscribe((res) => {
      this.role = res.role;
      if (!this.role || Object.keys(this.role).length === 0) this.router.navigateByUrl('wizard/roles');
    });
  }

  ngOnInit(): void {
  }

  handleChange() {
    this.isActive = !this.isActive;
    if (this.isActive === false) {
      if (this.role.password_policy !== null) {
        this.showConfirm = true;
      }
    } else {
      this.isActive = true;
    }
  }

  public confirmDialog(event: boolean): void {
    if (event) {
      // @ts-ignore
      const iden = this.role.password_policy.id.toLocaleLowerCase();
      this._roleService.deleteRolesPasswordPolicy(iden).subscribe((res: Response) => {
        if (res.error) {
          this._messageService.add({type: 'error', message: 'Error en la Eliminación' + res.msg,life: 5000});
        } else {
          this._messageService.add({type: 'success', message: 'Eliminación Exitosa' + res.msg,life: 5000});
          this.store.dispatch(deletePasswordPolicy({}));
          this.DocumentsPoliticiesForm.reset();
        }
      });
    } else {
      this.DocumentsPoliticiesForm.get('enable')?.setValue(true);
      this.isActive = true;
    }
  }

}
