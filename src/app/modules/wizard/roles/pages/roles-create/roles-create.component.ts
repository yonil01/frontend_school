import { Component, OnDestroy, OnInit } from '@angular/core';
import {Subscription} from "rxjs/internal/Subscription";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {Customer, Project, Role} from "@app/core/models";
import {RoleService} from "@app/modules/wizard/services/roles/role.service";
import {ToastService} from "ecapture-ng-ui";

@Component({
  selector: 'app-roles-create',
  templateUrl: './roles-create.component.html',
  styleUrls: ['./roles-create.component.scss']
})
export class RolesCreateComponent implements OnInit, OnDestroy {

  private _subscription: Subscription = new Subscription();
  public readonly toastStyle: ToastStyleModel = toastDataStyle;
  public isBlockPage: boolean = false;
  public roles: Role[] = [];
  private client: Customer;
  private project: Project;

  constructor(
    private _roleService: RoleService,
    private _messageService: ToastService
  ) {
    this.project = JSON.parse(sessionStorage.getItem('project') || '');
    this.client = JSON.parse(sessionStorage.getItem('client') || '');
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

}
