import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs/internal/Subscription";
import {RoleService} from "@app/modules/wizard/services/roles/role.service";
import {ToastService} from "ecapture-ng-ui";
import {Customer, Project, Response, Role} from "@app/core/models";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {Store} from "@ngrx/store";
import {AppState} from "@app/core/store/app.reducers";
import {Router} from "@angular/router";
import {controlRole, deleteDatedisallowed, deleteRole} from "@app/core/store/actions/roles.action";

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss']
})
export class RolesListComponent implements OnInit, OnDestroy {

  private _subscription: Subscription = new Subscription();
  public readonly toastStyle: ToastStyleModel = toastDataStyle;
  public isBlockPage: boolean = false;
  public roles: Role[] = [];
  private client: Customer;
  private project: Project;
  public nameClient: string = '';
  public nameProject: string = '';
  public showConfirmDelete: boolean = false;
  public data: any;
  public indexRoleDelete: number = 0;

  constructor(
    private _roleService: RoleService,
    private _messageService: ToastService,
    private _router: Router,
    private _store: Store<AppState>,
  ) {
    this.project = JSON.parse(sessionStorage.getItem('project') || '');
    this.client = JSON.parse(sessionStorage.getItem('client') || '');
    this.nameClient = this.client.name + '';
    this.nameProject = this.project.name + '';
  }

  ngOnInit(): void {
    this.isBlockPage = true;
    this._subscription.add(
      this._roleService.getRolesByProjectID(this.project.id.toLowerCase()).subscribe({
        next: (res) => {
          if (res.error) {
            this._messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            if (res.data) {
              this.roles = res.data;
              console.log(this.roles);
              console.log(res.data);
            } else {
              this._messageService.add({type: 'error', message: 'No roles found', life: 5000});
            }
          }
          this.isBlockPage = false;
          // this.store.dispatch(controlRoles({roles: res.data}));
        },
        error: (err: Error) => {
          this.isBlockPage = false;
          console.error(err.message);
          this._messageService.add({
            type: 'error',
            message: 'No se pudo obtener los roles para el proyecto!',
            life: 5000
          });
        }
      })
    );
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  public showRole(role: Role): void {
    this._store.dispatch(controlRole({ role: role, index: 0 }));
    this._router.navigateByUrl('wizard/roles/manager');
  }

  public createRole(): void {
    let roleNull:Role = {};
    this._store.dispatch(controlRole({ role: roleNull, index: 0 }));
    this._router.navigateByUrl('wizard/roles/create');
  }

  public editRole(role: Role): void {
    this._store.dispatch(controlRole({ role: role, index: 0 }));
    this._router.navigateByUrl('wizard/roles/create');
  }

  delete(role: Role): void {
    const relacion = [];
    const data = role.id?.toLocaleLowerCase();
    this.data = role.id?.toLocaleLowerCase();
    this.indexRoleDelete = this.roles.indexOf(role);
    for (const roll of this.roles) {
      if (roll.role_allow !== null && roll.role_allow !== undefined) {
        const info = roll.role_allow.find((el) => el.role_allow?.id?.toLocaleLowerCase() === data);
        if (info) {
          relacion.push(roll.name);
        }
      }
    }
    if (relacion.length > 0) {
      const roless = relacion.join(', ');
      this._messageService.add({type: 'error', message: 'No se puede Eliminar: El Rol esta asociado a los roles: ' + roless, life: 5000});
    } else if (role.roles_doc_types !== null && role.roles_doc_types !== undefined) {
      this._messageService.add({type: 'error', message: 'El Rol tiene Tipo Documentales asociados', life: 5000});
    } else if (role.role_elements !== null && role.role_elements !== undefined) {
      this._messageService.add({type: 'error', message: 'No se puede Eliminar: El Rol tiene Privilegios asociados', life: 5000});
    } else if (role.password_policy !== null && role.password_policy !== undefined) {
      this._messageService.add({type: 'error', message: 'No se puede Eliminar: El Rol tiene Politicas de Seguridad asociadas', life: 5000});
    } else if (role.date_disallowed !== null && role.date_disallowed !== undefined) {
      this._messageService.add({type: 'error', message: 'No se puede Eliminar: El Rol tiene Fechas Deshabilitadas asociadas', life: 5000});
    } else if (role.security_entities !== null && role.security_entities !== undefined) {
      this._messageService.add({type: 'error', message: 'No se puede Eliminar: El Rol tiene Seguridad de Atributos asociadas', life: 5000});
    } else if (role.role_allow !== null && role.role_allow !== undefined) {
      this._messageService.add({type: 'error', message: 'No se puede Eliminar: El Rol tiene Roles Permitidos asociados', life: 5000});
    } else {
      this.showConfirmDelete = true;
    }
  }

  confirmDialogDelete(event: boolean) {
    if (event) {
      this._roleService.deleteRole(this.data || '').subscribe((res: Response) => {
        if (res.error) {
          this._messageService.add({type: 'error', message: 'Error en la Eliminación', life: 5000});
        } else {
          this._messageService.add({type: 'success', message: 'Eliminación Exitosa', life: 5000});
          this._store.dispatch(deleteRole({ indexRole: this.indexRoleDelete }));
        }
        this.showConfirmDelete = false;
      });
    } else {
      this.showConfirmDelete = false;
    }
  }

}
