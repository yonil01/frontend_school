import { Component, OnInit } from '@angular/core';
import {Response, Role} from "@app/core/models";
import {FormBuilder} from "@angular/forms";
import {RoleService} from "@app/modules/wizard/services/roles/role.service";
import {EntityService} from "@app/modules/wizard/services/entity/entity.service";
import {Store} from "@ngrx/store";
import {AppState} from "@app/core/store/app.reducers";
import {DoctypegroupService} from "@app/modules/wizard/services/doctypegroup/doctypegroup.service";
import {Router} from "@angular/router";
import {ToastService} from "ecapture-ng-ui";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";

@Component({
  selector: 'app-roles-allowed-roles',
  templateUrl: './roles-allowed-roles.component.html',
  styleUrls: ['./roles-allowed-roles.component.scss']
})
export class RolesAllowedRolesComponent implements OnInit {

  public readonly toastStyle: ToastStyleModel = toastDataStyle;
  public isBlockPage: boolean = false;
  public role: Role = {};

  sourceRole: Role[] = [];
  sourceRoleNew: Role[] = [];
  targetRoleNew: Role[] = [];

  constructor(
    private formBulder: FormBuilder,
    private _roleService: RoleService,
    private entityService: EntityService,
    private store: Store<AppState>,
    private doctypegroupService: DoctypegroupService,
    private router: Router,
    private _messageService: ToastService,
  ) {
    this.store.select('role').subscribe((res) => {
      this.role = res.role;
      if (!this.role || Object.keys(this.role).length === 0) this.router.navigateByUrl('wizard/roles');
    });
  }

  ngOnInit(): void {
    this.getRoleAllow();
  }

  getRoleAllow(): void {
    this.isBlockPage = true;
    this._roleService.getRoles().subscribe((res: Response) => {
      if(!res.error){
        this.targetRoleNew = [];
        this.sourceRole = [];
        this.sourceRoleNew = [];
        if (this.role !== null) {
          const idRole = JSON.parse(JSON.stringify(this.role.id));
          this.sourceRole = res.data ? JSON.parse(JSON.stringify(res.data)) : [];
          if (this.role?.role_allow) {
            for (const rol of this.sourceRole) {
              // @ts-ignore
              if (rol.id.toLocaleLowerCase() !== idRole.toLocaleLowerCase()) {
                // @ts-ignore
                const roles = this.role.role_allow.find((el) => el.role_allow.id.toLocaleLowerCase() === rol.id.toLocaleLowerCase(),
                );
                if (roles) {
                  this.targetRoleNew.push(rol);
                } else {
                  this.sourceRoleNew.push(rol);
                }
              }
            }
          } else {
            for (const datRol of this.sourceRole) {
              // @ts-ignore
              if (datRol.id.toLocaleLowerCase() !== idRole.toLocaleLowerCase()) {
                this.sourceRoleNew.push(datRol);
              }
            }
          }
        }
      }else{
        this._messageService.add({
          type: 'error',
          message: res.msg,
          life: 5000
        });
      }
      this.isBlockPage = false;
    });
  }
  //getRoleAllow

  passSelected(){ //Pasar Seleccionados

  }

  passAll(){ //Pasar Todos

  }

  returnSelected(){ //Regresar Seleccionados

  }

  returnAll(){ //Regresar Todos

  }

}
