import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs/internal/Subscription";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {Customer, Project, Role} from "@app/core/models";
import {RoleService} from "@app/modules/wizard/services/roles/role.service";
import {ToastService} from "ecapture-ng-ui";
import {Store} from "@ngrx/store";
import {AppState} from "@app/core/store/app.reducers";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-roles-create',
  templateUrl: './roles-create.component.html',
  styleUrls: ['./roles-create.component.scss']
})
export class RolesCreateComponent implements OnInit, OnDestroy {

  roleForm: FormGroup;
  private _subscription: Subscription = new Subscription();

  public readonly toastStyle: ToastStyleModel = toastDataStyle;
  public isBlockPage: boolean = false;
  public isEdit: boolean = true;
  public showConfirm: boolean = false;

  public role: Role = {};

  private client: Customer;
  private project: Project;

  constructor(
    private store: Store<AppState>,
    private _router: Router,
    private _roleService: RoleService,
    private _messageService: ToastService,
    private fb: FormBuilder,
  ) {
    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(60)]],
      description: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(60)]],
      sessions_allowed: ['', [Validators.required, Validators.min(1), Validators.max(10000)]],
      see_all_users: [false]
    });

    this.project = JSON.parse(sessionStorage.getItem('project') || '');
    this.client = JSON.parse(sessionStorage.getItem('client') || '');
  }

  ngOnInit(): void {
    this.store.select('role').subscribe((res) => {
      this.role = res.role;
      if (!this.role || Object.keys(this.role).length === 0) this.isEdit = false;
      if (this.isEdit) {
        this.roleForm.setValue({
          name: this.role.name,
          description: this.role.description,
          sessions_allowed: this.role.sessions_allowed,
          see_all_users: this.role.see_all_users
        });
      }
      this.isBlockPage = false;
    });
  }

  ngOnDestroy(): void {
  }

  get nameRole() {
    return this.roleForm.get('name');
  }

  get descriptionRole() {
    return this.roleForm.get('description');
  }

  get sessionsRole() {
    return this.roleForm.get('sessions_allowed');
  }

  saveRole() {
    this.role = {
      ...this.roleForm.value,
      id: uuidv4().toLowerCase(),
    };
    this.showConfirm = true;
  }

  public confirmDialog(event: boolean): void {
    debugger;
    if (event) {
      if (!this.isEdit) {
        this._subscription.add(
          this._roleService.createRole(this.role).subscribe({
            next: (res) => {
              if (res.error) {
                this._messageService.add({type: 'error', message: res.msg, life: 5000});
              } else {
                this.roleForm.reset();
                this._router.navigateByUrl('wizard/roles');
                this._messageService.add({type: 'info', message: 'Rol Creado Correctamente', life: 5000});
              }
              this.isBlockPage = false;
              this.showConfirm = false;
            },
            error: (err: Error) => {
              this._messageService.add({
                type: 'error',
                message: 'No se pudo obtener los roles para el proyecto!',
                life: 5000
              });
              this.isBlockPage = false;
              this.showConfirm = false;
            }
          })
        );
      } else {
        //Service Edit Role
        this._subscription.add(
          this._roleService.updateRole(this.role).subscribe({
            next: (res) => {
              if (res.error) {
                this._messageService.add({type: 'error', message: res.msg, life: 5000});
              } else {
                this._messageService.add({type: 'success', message: 'Rol Editado Correctamente', life: 5000});
                this._router.navigateByUrl('wizard/roles');
              }
              this.isBlockPage = false;
              this.showConfirm = false;
            },
            error: (err: Error) => {
              this._messageService.add({
                type: 'error',
                message: 'No se pudo obtener los roles para el proyecto!',
                life: 5000
              });
              this.isBlockPage = false;
              this.showConfirm = false;
            }
          })
        );
      }
    } else {
      this.showConfirm = false;
      if(!this.isEdit){
        this.roleForm.reset();
        this._messageService.add({type: 'info', message: 'Registro Cancelado', life: 5000});
      }else{
        this._messageService.add({type: 'info', message: 'Edición Cancelada', life: 5000});
      }
    }
  }


}
