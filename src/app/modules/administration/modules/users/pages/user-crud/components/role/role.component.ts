import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StepModel} from "@app/ui/components/step/models/step-vertical-model";
import {CrudModel} from "@app/modules/administration/modules/users/models/user-crud-model/user-crud-constans";
import {Response, RoleAllowed, User, UserRole} from "@app/core/models";
import {UsersService} from "@app/modules/administration/modules/users/service/user/users.service";
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import {showLoader} from "@app/modules/administration/modules/users/models/model-user/constans-user";
@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
  @Input() user: User;
  public styleStep: StepModel = CrudModel;
  public rolesAvailables: RoleAllowed[] = [];
  public rolesSelected: RoleAllowed[] = [];
  public rolesAllow: RoleAllowed[] = [];
  public rolesForSecuryEntities: RoleAllowed[] = [];
  public callServicesCount = 0;
  public usersRoles: UserRole[] = [];
  public sourceProducts: any = [];
  public targetProducts:any = [];
  public showLoader: any = showLoader;
  @Output() showToast = new EventEmitter<any>();
  constructor(private userService: UsersService,) {
    this.user = {}
  }



  ngOnInit(): void {
    this.getRolesAllowByUser();
  }

  public nextStep(index: number) {
    if (this.usersRoles.length) {
      this.styleStep.dataSourceStep.forEach((item: any, i:number) => {
        if (index === i) {
          item.status = 'Completed'
        }
        if ((index + 1) === i) {
          item.focus = true;
          item.block = false;
        } else {
          item.focus = false;
        }
      })
    }
  }
  public backStep(index: number) {
    this.styleStep.dataSourceStep.forEach((item: any, i:number) => {
      if (index === i) {
        item.status = 'Completed'
      }
      if ((index - 1) === i) {
        item.focus = true;
      } else {
        item.focus = false;
      }
    })
  }

  private getRolesAllowByUser(): void {
    this.showLoading(true);
    this.userService.getRolesAllowByUser().subscribe((response: Response) => {
      if (!response.error) {
        this.rolesAllow = response.data;
        this.rolesForSecuryEntities = JSON.parse(JSON.stringify(this.rolesAllow));
        this.getUsersRolesByUserID();
      }
    });
  }

  private getUsersRolesByUserID(): void {
    this.rolesAvailables = JSON.parse(JSON.stringify(this.rolesAllow));
    if (this.callServicesCount === 0 && this.user) {
      this.userService.getUsersRolesByUserID(this.user.id ? this.user.id : '').subscribe((response) => {
        if (!response.error) {
          this.rolesSelected = [];
          this.usersRoles = response.data ? response.data : [];
          for (const userRole of this.usersRoles) {
            const indexRole = this.rolesAvailables.findIndex(
              (ra: any) => ra.role_allow.id.toLowerCase() === userRole.role_id?.toLowerCase(),
            );
            if (indexRole >= 0) {
              const roles = this.rolesAvailables.splice(indexRole, 1);
              this.rolesSelected.push(roles[0]);
            }
          }
          this.showLoading(false);
          this.rolesForSecuryEntities = JSON.parse(JSON.stringify(this.rolesSelected));
        }
      });
    }
  }

  onMoveToSelected(roles: RoleAllowed[]): void {
    this.showLoading(true);
    this.callServicesCount = 0;
    for (const role of roles) {
      const userRole: UserRole = {
        id: uuidv4().toLowerCase(),
        user_id: this.user.id?.toLowerCase(),
        role_id: role.role_allow?.id!.toLowerCase(),
      };
      this.callServicesCount++;
      this.userService.createUserRoles(userRole).subscribe((res) => {
        this.showLoading(false);
        this.callServicesCount--;
        this.showLoading(true);
        if (res.error) {
          this.addToast({
            type: 'error',
            message: res.msg,
            life: 5000,
          });
        } else {
          this.addToast({
            type: 'success',
            message: res.msg,
            life: 5000,
          });
        }
        this.getUsersRolesByUserID();
      });
    }
  }


  onMoveToAvailable(roles: RoleAllowed[]): void {
    this.showLoading(true);
    this.callServicesCount = 0;
    for (const role of roles) {
      const userRole: UserRole = this.usersRoles.find((ur) =>
          ur.user_id?.toLowerCase() === this.user.id?.toLowerCase() &&
          ur.role_id?.toLowerCase() === role.role_allow?.id!.toLowerCase(),
      )!;
      this.callServicesCount++;
      this.userService.deleteUsersRoles(userRole?.id!.toLowerCase()).subscribe((res) => {
        this.showLoading(false);
        this.showLoading(false);
        this.callServicesCount--;
        if (res.error) {
          this.addToast({
            type: 'error',
            message: res.msg,
            life: 5000,
          });
        } else {
          this.addToast({
            type: 'success',
            message: res.msg,
            life: 5000,
          });
        }
        this.getUsersRolesByUserID();
      });
    }

  }

  public showLoading(value: boolean) {
    this.showLoader.forEach((item: any) => {
      item.value = value;
    })
  }

  public addToast(data: any): void {
    this.showToast.emit({type: data.type, message: data.message, life: data.life});
  }
}
