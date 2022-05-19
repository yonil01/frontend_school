import {Component, OnDestroy, OnInit} from '@angular/core';
import {Response, Role, RoleAllowed} from "@app/core/models";
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
import {v4 as uuidv4} from "uuid";
import {Subscription} from "rxjs/internal/Subscription";

@Component({
  selector: 'app-roles-allowed-roles',
  templateUrl: './roles-allowed-roles.component.html',
  styleUrls: ['./roles-allowed-roles.component.scss']
})
export class RolesAllowedRolesComponent implements OnInit, OnDestroy {

  private _subscription: Subscription = new Subscription();

  public readonly toastStyle: ToastStyleModel = toastDataStyle;
  public isBlockPage: boolean = false;
  public role: Role = {};

  public rolesSelected: Role[] = [];
  public rolesAvailable: Role[] = [];

  sourceRole: Role[] = [];

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

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  getRoleAllow(): void {
    this.isBlockPage = true;
    this._roleService.getRoles().subscribe((res: Response) => {
      if(!res.error){
        this.rolesSelected = [];
        this.sourceRole = [];
        this.rolesAvailable = [];
        if (this.role !== null) {
          const idRole = JSON.parse(JSON.stringify(this.role.id));
          this.sourceRole = res.data ? JSON.parse(JSON.stringify(res.data)) : [];
          if (this.role?.role_allow) {
            for (const rol of this.sourceRole) {
              if (rol.id?.toLocaleLowerCase() !== idRole.toLocaleLowerCase()) {
                const roles = this.role.role_allow.find((el) => el.role_allow?.id?.toLocaleLowerCase() === rol.id?.toLocaleLowerCase(),
                );
                if (roles) {
                  this.rolesSelected.push(rol);
                } else {
                  this.rolesAvailable.push(rol);
                }
              }
            }
          } else {
            for (const datRol of this.sourceRole) {
              if (datRol.id?.toLocaleLowerCase() !== idRole.toLocaleLowerCase()) {
                this.rolesAvailable.push(datRol);
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

  getRoleAllowUpdate(){
    this.isBlockPage = true;
    this._roleService.getRoles().subscribe((res: Response) => {
      if(!res.error){
        this.sourceRole = res.data ? JSON.parse(JSON.stringify(res.data)) : [];
        this.role = this.sourceRole.find((doc: Role) => doc.id?.toLowerCase() === this.role.id?.toLowerCase()) || this.role;
      }else{
        this._messageService.add({
          type: 'error',
          message: 'Recargue la página - '+res.msg,
          life: 5000
        });
      }
      this.isBlockPage = false;
    });
  }

  public assignItemsRoles(items: string[]): void {
    const roleAlloweds: RoleAllowed[] = [];
    const datos = JSON.parse(JSON.stringify(items));
    for (const role of datos) {
      const roleAllowed: RoleAllowed = {
        id: uuidv4().toLowerCase(),
        role_allow: role,
        role_id: this.role.id?.toLowerCase(),
      };
      roleAlloweds.push(roleAllowed);
    }
    this.isBlockPage = true;
    this._subscription.add(
      this._roleService.createRolesAllow(roleAlloweds).subscribe({
        next: (res) => {
          if (res.error) {
            this._messageService.add({message: res.msg, type: 'error', life: 5000});
          } else {
            this._messageService.add({
              message: 'Se asigno correctamente los roles al rol',
              type: 'success',
              life: 5000
            });
            for (const allow of roleAlloweds) {
              this.rolesAvailable = this.rolesAvailable.filter((roles) => roles.id?.toLowerCase() !== allow.role_allow);
              const doc = this.sourceRole.find((doc) => doc.id?.toLowerCase() === allow.role_allow);
              if (doc) {
                this.rolesSelected.push(doc);
              }
            }
          }
          this.getRoleAllowUpdate();
          this.isBlockPage = false;
        },
        error: (err: Error) => {
          this.isBlockPage = false;
          console.error(err.message);
          this._messageService.add({
            message: 'Ocurrio un error cuando se trato de agregar los roles al rol!',
            type: 'error',
            life: 5000
          });
        }
      })
    );
  }

  public unAssignItemsRoles(datos: string[]): void {
    this.isBlockPage = true;
    let idsRoleAllow: string[] = [];

    for(let rol of datos){
      const role_selected = this.role.role_allow?.find((doc) => doc.role_allow?.id?.toLowerCase() === rol.toLowerCase());
      idsRoleAllow.push(role_selected?.id+'');
    }
    if (datos) {
      this._subscription.add(
        this._roleService.deleteRolesAllow(idsRoleAllow || '').subscribe({
          next: (res) => {
            if (res.error) {
              this._messageService.add({message: res.msg, type: 'error', life: 5000});
            } else {
              this._messageService.add({
                message: 'Se elimino correctamente el rol del rol',
                type: 'success',
                life: 5000
              });
              for(let role of datos){
                this.rolesSelected = this.rolesSelected.filter((roles) => roles.id?.toLowerCase() !== role.toLowerCase());
                const doc = this.sourceRole.find((doc) => doc.id?.toLowerCase() === role.toLowerCase());
                if (doc) {
                  this.rolesAvailable.push(doc);
                }
              }
              this.getRoleAllowUpdate();
            }
            this.isBlockPage = false;
          },
          error: (err: Error) => {
            this.isBlockPage = false;
            this._messageService.add({
              message: 'Ocurrio un error cuando se trato de eliminar el rol del rol!',
              type: 'error',
              life: 5000
            });
            console.error(err.message);
          }
        })
      );
    }
  }

}
