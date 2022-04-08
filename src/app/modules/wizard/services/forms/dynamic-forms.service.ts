import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {map} from 'rxjs/operators';
import {Response, Role} from '@app/core/models';
import {Observable} from 'rxjs';
import {
  GetEntitiesPruebaQuery, UpdateRoleMutation, DeleteRolesPasswordPolicyMutation
} from '../roles/role.queries.service';


@Injectable({
  providedIn: 'root',
})
export class CreateRoleService {

  constructor(
    private apollo: Apollo,
    /*private getRoleByIDQueryQuery: GetRoleByIDQueryQuery,*/
    private getEntitiesPruebaQuery: GetEntitiesPruebaQuery,
    private updateRoleMutation: UpdateRoleMutation,
    private DeleteRolesPasswordPolicyMutation: DeleteRolesPasswordPolicyMutation,
    /*private createRoleQuery: CreateRoleQuery*/
  ) {
  }

 /* public getRolesByProject(id: string): Observable<Response> {
    return this.getRoleByIDQueryQuery.watch({id}).valueChanges.pipe(map(({data}: any) => data.getRoleByIDQueryQuery));
  }*/

  getEntitiesPrueba(): Observable<Response> {
    return this.getEntitiesPruebaQuery
      .watch()
      .valueChanges.pipe(map(({data}: any) => data.getEntities));
  }


  public updateRole(roles: Role): Observable<Response> {
    return this.updateRoleMutation.mutate({rq: {data: roles}}).pipe(map(({data}: any) => data.updateRole));
  }

/*  public createRole(roles: Role): Observable<Response> {
    return this.createRoleQuery.mutate({rq: {data: roles}}).pipe(map(({data}: any) => data.createRoleQuery));
  }*/


}



