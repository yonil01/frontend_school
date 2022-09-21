import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StepModel} from "@app/ui/components/step/models/step-vertical-model";
import {CrudModel} from "@app/modules/administration/modules/subject/models/subject-crud-model/subject-crud-constans";
import {Response, RoleAllowed, Roles, Subject, RolesAllowSubject, SubjectRole} from "@app/core/models";
import { JwtHelperService } from '@auth0/angular-jwt';
const helper = new JwtHelperService();
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import {showLoader} from "@app/modules/administration/modules/subject/models/model-subject/constans-subject";
import {Subscription} from "rxjs/internal/Subscription";
import {SubjectsService} from "@app/modules/administration/modules/subject/service/subject/subject.service";
@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
  @Input() Subject: Subject;
  public styleStep: StepModel = CrudModel;
  public rolesAvailables: RoleAllowed[] = [];
  public rolesSelected: RoleAllowed[] = [];
  public rolesAllow: RoleAllowed[] = [];
  public rolesForSecuryEntities: RoleAllowed[] = [];
  public callServicesCount = 0;
  public SubjectsRoles: SubjectRole[] = [];
  public sourceProducts: any = [];
  public targetProducts:any = [];
  public isBlockPage: boolean = false;
  private _subscription: Subscription = new Subscription();
  public showLoader: any = showLoader;
  @Output() showToast = new EventEmitter<any>();
  constructor(private SubjectService: SubjectsService,) {
    this.Subject = {}
  }



  ngOnInit(): void {
    this.getRolesAllowBySubject();
  }

  public nextStep(index: number) {
    if (this.SubjectsRoles.length) {
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

  private getRolesAllowBySubject(): void {
    const dataToken = helper.decodeToken(String(sessionStorage.getItem('Token')));
    this._subscription.add(
      this.SubjectService.getSubjectByID(dataToken.Subject.id).subscribe((resp: Response)=> {
        if (resp.error) {
          this.addToast({
            type: 'error',
            message: resp.msg,
            life: 5000,
          });
        } else {
          if (resp.data) {
            resp.data.roles?.forEach((roles:Roles)=> {
              if (roles.role_allow) {
                roles.role_allow.forEach((item: RoleAllowed)=> {
                  if (item.role_allow) {
                    this.rolesAllow.push(item)
                  }
                })
              }
            })
            this.getSubjectsRolesBySubjectID();
          }
        }
      })
    )

  }

  private getSubjectsRolesBySubjectID(): void {
    const uniqueAddresses = Array.from(new Set(this.rolesAllow.map((a: RoleAllowed) => a.role_allow?.id)))
      .map(id => {
        return this.rolesAllow.find((a:RoleAllowed) => a.role_allow?.id === id)
      })
    this.rolesAvailables = JSON.parse(JSON.stringify(uniqueAddresses));
    if (this.callServicesCount === 0 && this.Subject) {
      this.SubjectService.getSubjectsRolesBySubjectID(this.Subject.dni ? this.Subject.dni : '').subscribe(
        (response) => {
        if (!response.error) {
          this.rolesSelected = [];
          this.SubjectsRoles = response.data ? response.data : [];
          for (const SubjectRole of this.SubjectsRoles) {
            const indexRole = this.rolesAvailables.findIndex(
              (ra: any) => ra.role_allow.id.toLowerCase() === SubjectRole.role_id?.toLowerCase(),
            );
            if (indexRole >= 0) {
              const roles = this.rolesAvailables.splice(indexRole, 1);
              this.rolesSelected.push(roles[0]);
            }
          }
          this.isBlockPage = false;
          this.rolesForSecuryEntities = JSON.parse(JSON.stringify(this.rolesSelected));
        } else {
          this.isBlockPage = false;
        }
      });
    }
  }

  onMoveToSelected(roles: RoleAllowed[]): void {
    this.isBlockPage = true;
    this.callServicesCount = 0;
    for (const role of roles) {
      const SubjectRole: SubjectRole = {
        id: uuidv4().toLowerCase(),
        role_id: role.role_allow?.id!.toLowerCase(),
      };
      this.callServicesCount++;
      this.SubjectService.createSubjectRoles(SubjectRole).subscribe((res) => {
        this.isBlockPage = false;
        this.callServicesCount--;
        this.isBlockPage = true;
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
        this.getSubjectsRolesBySubjectID();
      });
    }
  }


  onMoveToAvailable(roles: RoleAllowed[]): void {
    this.isBlockPage = true;
    this.callServicesCount = 0;
    for (const role of roles) {
      const SubjectRole: SubjectRole = this.SubjectsRoles.find((ur) =>
          ur.id?.toLowerCase() === this.Subject.dni?.toLowerCase() &&
          ur.role_id?.toLowerCase() === role.role_allow?.id!.toLowerCase(),
      )!;
      this.callServicesCount++;
      this.SubjectService.deleteSubjectsRoles(SubjectRole?.id!.toLowerCase()).subscribe((res) => {
        this.isBlockPage = false;
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
        this.getSubjectsRolesBySubjectID();
      });
    }

  }


  public addToast(data: any): void {
    this.showToast.emit({type: data.type, message: data.message, life: data.life});
  }
}
