import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs/internal/Subscription";
import {RoleService} from "@app/modules/wizard/services/roles/role.service";
import {ToastService} from "ecapture-ng-ui";
import {Customer, Project, Role} from "@app/core/models";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {Store} from "@ngrx/store";
import {AppState} from "@app/core/store/app.reducers";
import {Router} from "@angular/router";
import {controlRole} from "@app/core/store/actions/roles.action";

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
}
