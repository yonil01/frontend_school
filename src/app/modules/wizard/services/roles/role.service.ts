import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {map} from 'rxjs/operators';
import {
  Response,
  Role,
  RolesDoctype,
  PasswordPolicy,
  DateDisallowed,
  Elements,
  RoleAllowed,
  SecurityEntities,
  Attributes,
} from '@app/core/models';
import {Observable} from 'rxjs';
import {
  GetRolesQuery,
  CreateRoleMutation,
  UpdateRoleMutation,
  DeleteRoleMutation,
  CreateRolesDoctypeMutation,
  DeleteRolesDoctypeMutation,
  GetRolesDoctypeQuery,
  CreateRolesPasswordPolicyMutation,
  UpdateRolesPasswordPolicyMutation,
  DeleteRolesPasswordPolicyMutation,
  CreateRolesDateDisallowedMutation,
  UpdateRolesDateDisallowedMutation,
  DeleteRolesDateDisallowedMutation,
  CreateRolesElementMutation,
  DeleteRolesElementMutation,
  GetRolesElementQuery,
  CreateRolesAllowMutation,
  DeleteRolesAllowMutation,
  CreateRolesSecurityEntityMutation,
  DeleteRolesSecurityEntityMutation,
  CreateRolesAttributeMutation,
  UpdateRolesAttributeMutation,
  DeleteRolesAttributeMutation,
  GetEntitiesPruebaQuery,
  GetModulesQuery,
  GetRolesByProjectIDQuery,
} from '../roles/role.queries.service';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(
    private apollo: Apollo,
    private getRolesQuery: GetRolesQuery,
    private getRolesByProjectIDQuery: GetRolesByProjectIDQuery,
    private createRoleQuery: CreateRoleMutation,
    private updateRoleMutation: UpdateRoleMutation,
    private deleteRoleQuery: DeleteRoleMutation,
    private createRolesDoctypeMutation: CreateRolesDoctypeMutation,
    private deleteRolesDoctypeMutation: DeleteRolesDoctypeMutation,
    private getRolesDoctypeQuery: GetRolesDoctypeQuery,
    private createRolesPasswordPolicyMutation: CreateRolesPasswordPolicyMutation,
    private updateRolesPasswordPolicyMutation: UpdateRolesPasswordPolicyMutation,
    private deleteRolesPasswordPolicyMutation: DeleteRolesPasswordPolicyMutation,
    private createRolesDateDisallowedMutation: CreateRolesDateDisallowedMutation,
    private updateRolesDateDisallowedMutation: UpdateRolesDateDisallowedMutation,
    private deleteRolesDateDisallowedMutation: DeleteRolesDateDisallowedMutation,
    private createRolesElementMutation: CreateRolesElementMutation,
    private deleteRolesElementMutation: DeleteRolesElementMutation,
    private getRolesElementQuery: GetRolesElementQuery,
    private createRolesAllowMutation: CreateRolesAllowMutation,
    private deleteRolesAllowMutation: DeleteRolesAllowMutation,
    private getEntitiesPruebaQuery: GetEntitiesPruebaQuery,
    private createRolesSecurityEntityMutation: CreateRolesSecurityEntityMutation,
    private createRolesAttributeMutation: CreateRolesAttributeMutation,
    private updateRolesAttributeMutation: UpdateRolesAttributeMutation,
    private deleteRolesAttributeMutation: DeleteRolesAttributeMutation,
    private deleteRolesSecurityEntityMutation: DeleteRolesSecurityEntityMutation,
    private getModulesQuery: GetModulesQuery,
  ) {
  }

  getRoles(): Observable<Response> {
    return this.getRolesQuery.watch().valueChanges.pipe(map(({data}: any) => data.getRoles));
  }

  getRolesByProjectID(project_id: string): Observable<Response> {
    return this.getRolesByProjectIDQuery.watch({project_id}).valueChanges.pipe(map(({data}: any) => data.getRolesByProjectID));
  }

  // CRUD Roles
  createRole(roles: Role): Observable<Response> {
    return this.createRoleQuery
      .mutate({
        rq: {data: roles},
      })
      .pipe(map(({data}: any) => data.createRole));
  }

  updateRole(roles: Role): Observable<Response> {
    return this.updateRoleMutation
      .mutate({
        rq: {data: roles},
      })
      .pipe(map(({data}: any) => data.updateRole));
  }

  deleteRole(id: string): Observable<Response> {
    return this.deleteRoleQuery
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => data.deleteRole));
  }

  // CRUD Roles Doctype
  getRolesDoctype(): Observable<Response> {
    return this.getRolesDoctypeQuery.watch().valueChanges.pipe(map(({data}: any) => data.getRolesDoctype));
  }

  createRolesDoctype(roleDt: RolesDoctype[]): Observable<Response> {
    return this.createRolesDoctypeMutation
      .mutate({
        rq: {data: roleDt},
      })
      .pipe(map(({data}: any) => data.createRolesDoctypes));
  }

  deleteRolesDoctype(id: string[]): Observable<Response> {
    return this.deleteRolesDoctypeMutation
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => data.deleteRolesDoctypes));
  }

  // CRUD Roles Password Policy
  createRolesPasswordPolicy(rolePp: PasswordPolicy): Observable<Response> {
    return this.createRolesPasswordPolicyMutation
      .mutate({
        rq: {data: rolePp},
      })
      .pipe(map(({data}: any) => data.createRolesPasswordPolicy));
  }

  updateRolesPasswordPolicy(rolePP: PasswordPolicy): Observable<Response> {
    return this.updateRolesPasswordPolicyMutation
      .mutate({
        rq: {data: rolePP},
      })
      .pipe(map(({data}: any) => data.updateRolesPasswordPolicy));
  }

  deleteRolesPasswordPolicy(id: string): Observable<Response> {
    return this.deleteRolesPasswordPolicyMutation
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => data.deleteRolesPasswordPolicy));
  }

  // CRUD Date Disallowed
  createRolesDateDisallowed(dateD: DateDisallowed): Observable<Response> {
    return this.createRolesDateDisallowedMutation
      .mutate({
        rq: {data: dateD},
      })
      .pipe(map(({data}: any) => data.createRolesDateDisallowed));
  }

  updateRolesDateDisallowed(dateD: DateDisallowed): Observable<Response> {
    return this.updateRolesDateDisallowedMutation
      .mutate({
        rq: {data: dateD},
      })
      .pipe(map(({data}: any) => data.updateRolesDateDisallowed));
  }

  deleteRolesDateDisallowed(id: string): Observable<Response> {
    return this.deleteRolesDateDisallowedMutation
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => data.deleteRolesDateDisallowed));
  }

  // CRUD Elements
  createRolesElement(dateE: Elements): Observable<Response> {
    return this.createRolesElementMutation
      .mutate({
        rq: {data: dateE},
      })
      .pipe(map(({data}: any) => data.createRolesElement));
  }

  deleteRolesElement(id: string): Observable<Response> {
    return this.deleteRolesElementMutation
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => data.deleteRolesElement));
  }

  getRolesElement(): Observable<Response> {
    return this.getRolesElementQuery.watch().valueChanges.pipe(map(({data}: any) => data.getRolesElement));
  }

  // CRUD Role Allowed
  createRolesAllow(dateRoleA: RoleAllowed[]): Observable<Response> {
    return this.createRolesAllowMutation
      .mutate({
        rq: {data: dateRoleA},
      })
      .pipe(map(({data}: any) => data.createRolesAllows));
  }

  deleteRolesAllow(id: string[]): Observable<Response> {
    return this.deleteRolesAllowMutation
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => data.deleteRolesAllows));
  }


  createRolesSecurityEntity(dateRoleSec: SecurityEntities): Observable<Response> {
    return this.createRolesSecurityEntityMutation
      .mutate({
        rq: {data: dateRoleSec},
      })
      .pipe(map(({data}: any) => data.createRolesSecurityEntity));
  }

  createRolesAttribute(dateRoleAttr: Attributes): Observable<Response> {
    return this.createRolesAttributeMutation
      .mutate({
        rq: {data: dateRoleAttr},
      })
      .pipe(map(({data}: any) => data.createRolesAttribute));
  }

  updateRolesAttribute(dateRoleAttr: Attributes): Observable<Response> {
    return this.updateRolesAttributeMutation
      .mutate({
        rq: {data: dateRoleAttr},
      })
      .pipe(map(({data}: any) => data.updateRolesAttribute));
  }

  deleteRolesAttribute(id: string): Observable<Response> {
    return this.deleteRolesAttributeMutation
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => data.deleteRolesAttribute));
  }

  deleteRolesSecurityEntity(id: string): Observable<Response> {
    return this.deleteRolesSecurityEntityMutation
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => data.deleteRolesSecurityEntity));
  }

  getEntitiesPrueba(): Observable<Response> {
    return this.getEntitiesPruebaQuery.watch().valueChanges.pipe(map(({data}: any) => data.getEntities));
  }

  getModules(): Observable<Response> {
    return this.getModulesQuery.watch().valueChanges.pipe(map(({data}: any) => data.getModules));
  }
}
