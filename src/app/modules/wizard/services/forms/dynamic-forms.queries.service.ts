import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Mutation, Query } from 'apollo-angular';
import { Response } from 'core/models';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GetRoleByIDQueryQuery extends Query<Response> {

  document = gql`
    query GetRoleByIDQuery($id: String!) {
        getRoleByID (id:$id ){
          error
          data {
            id
            description
            doc_types
          }
          code
          type
          msg
          token
        }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
//  TODO QUITAR
export class GetEntitiesQuery extends Query<Response> {
  document = gql`
    query getEntities {

      getEntities{
        error
        data {
          id
          project
        }
        code
        type
        msg
        token
      }
    }
  `;
}


@Injectable({
  providedIn: 'root',
})
export class GetRolesQuery extends Query<Response> {
  getRoles(): Observable<Response> {
    return this.apollo
    .watchQuery({
      query: gql`
        query getRoles {
          getRoles{
            error
            data {
              id
              description
              sessions_allowed
              date_disallowed {  description
                begins_at
                ends_at
              }
              password_policy {
                store_pass_not_repeated
                max_length
                min_length
                days_pass_valid
                failed_attempts
                time_unlock
                alpha
                digits
                special
                upper_case
                lower_case
                enable
                inactivity_time
                timeout
              }
              security_entities {
                id
                attributes {
                  id
                  value
                  enable
                }
              }
              doc_types
              elements
              projects
              process

            }
            code
            type
            msg
          }
        }
      `,
    })
    .valueChanges.pipe(map(({ data }: any) => data.getRoles));
  }
}

// NUEVO QUERY

@Injectable({
  providedIn: 'root',
})
export class GetEntitiesPruebaQuery extends Query<Response> {
  document = gql`
    query getEntities {
      getEntities {
        error
        code
        data {
          id
          project
        }
        type
        msg
      }
    }
  `;
}


@Injectable({
  providedIn: 'root',
})
export class UpdateRoleMutation extends Mutation {
  document = gql`
    mutation updateRole($rq: RequestRole!) {
      updateRole(input: $rq) {
        error
        code
        data {
          id
        }
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class CreateRoleQuery extends Mutation {
  document = gql`
  mutation createRole($rq: RequestRole!){
    createRole(input: $rq){
      error
      data {
        id
      }
      code
      type
      msg
      token
    }
  }
  `;
}
