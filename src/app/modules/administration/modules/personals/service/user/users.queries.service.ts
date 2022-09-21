import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Mutation, Query } from 'apollo-angular';
@Injectable({
  providedIn: 'root',
})
export class GetPersonalsQueryCpy extends Query<Response> {
  document = gql`
    query getPersonals {
      getPersonals {
        error
        data {
          id
          status
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class GetPersonalsQuery extends Query<Response> {
  document = gql`
    query getPersonals {
      getPersonals {
        error
        data {
          id
          Personalname
          name
          last_name
          email_notifications
          identification_number
          identification_type
          status
          roles {
            id
            name
          }
          security_entities {
            id
            entity {
              id
              name
            }
            attributes {
              id
              value
              enable
            }
          }
          created_at
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class GetPersonalsByRolesAllowQuery extends Query<Response> {
  document = gql`
    query getPersonalsByRolesAllow {
      getPersonalsByRolesAllow {
        error
        data {
          id
          Personalname
          name
          last_name
          email_notifications
          identification_number
          identification_type
          status
          roles {
            id
            name
            role_allow {
              role_allow{
                id
                name
              }
            }
          }
          security_entities {
            id
            entity {
              id
              name
            }
            attributes {
              id
              value
              enable
              attribute {
                id
                name
              }
            }
          }
          created_at
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class GetPersonalByIDQuery extends Query<Response> {
  document = gql`
    query getPersonalByID($id: String!) {
      getPersonalByID(id: $id) {
        error
        data {
          id
          Personalname
          name
          last_name
          email_notifications
          identification_number
          identification_type
          status
          roles {
            id
            name
            role_allow {
          role_allow {
            id
            name
          }
        }
          }
          security_entities {
            id
            entity {
              id
              name
            }
            attributes {
              id
              value
              enable
              attribute {
                id
                name
              }
            }
          }
          created_at
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class CreatePersonalQuery extends Mutation {
  document = gql`
    mutation createPersonal($rq: RequestNewPersonal!) {
  createPersonal(input: $rq) {
    error
    code
    data {
      id
      name
      Personalname
      last_name
      email_notifications
      identification_number
      identification_type
      status
      roles {
            id
            name
            role_allow {
              role_allow{
                id
                name
              }
            }
          }
      security_entities {
            id
            entity {
              id
              name
            }
            attributes {
              id
              value
              enable
              attribute {
                id
                name
              }
            }
          }
      failed_attempts
      last_change_password
      block_date
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
// definicion nueva clase para crear Roles
export class CreatePersonalsRolesQuery extends Mutation {
  document = gql`
    mutation createPersonalsRoles($req: RequestNewPersonalsRoles!) {
      createPersonalsRoles(input: $req) {
        error
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class UpdatePersonalQuery extends Mutation {
  document = gql`
    mutation updatePersonal($rq: RequestUpdatePersonal!) {
      updatePersonal(input: $rq) {
        error
        data {
          id
          name
          last_name
          email_notifications
          identification_number
          identification_type
        }
        code
        type
        msg
      }
    }
  `;
}
@Injectable({
  providedIn: 'root',
})
export class DeletePersonalQuery extends Mutation {
  document = gql`
    mutation deletePersonal($id: ID!) {
      deletePersonal(id: $id) {
        error
        code
        type
        msg
      }
    }
  `;
}
@Injectable({
  providedIn: 'root',
})
export class BlockPersonalQuery extends Mutation {
  document = gql`
    mutation blockPersonal($id: ID!) {
      blockPersonal(id: $id) {
        error
        code
        type
        msg
      }
    }
  `;
}
@Injectable({
  providedIn: 'root',
})
export class UnBlockPersonalQuery extends Mutation {
  document = gql`
    mutation unblockPersonal($id: ID!) {
      unblockPersonal(id: $id) {
        error
        code
        type
        msg
      }
    }
  `;
}
@Injectable({
  providedIn: 'root',
})
export class LogoutPersonalQuery extends Mutation {
  document = gql`
    mutation logout($id: String!) {
      logout(id: $id) {
        error
        data {
          id
        }
        code
        type
        token
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
/*export class GetRoles extends Query<Response> {
  document = gql`
    query getRoles {
      getRoles {
        error
        data {
          id
          description
        }
        code
        type
        msg
      }
    }
  `;
}*/

@Injectable({
  providedIn: 'root',
})
export class GetRolesAllowByPersonalQuery extends Query<Response> {
  document = gql`
    query getRolesAllowByPersonal {
      getRolesAllowByPersonal {
        error
        data {
          id
          role_allow {
            id
            name
            security_entities {
              id
              entity {
                id
                name
              }
              role_attribute {
                id
                attribute {
                  id
                  name
                }
                value
              }
            }
          }
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class GetRolesById extends Query<Response> {
  document = gql`
    query getRoleByID($id: ID!) {
      getRoleByID(id: $id) {
        data {
          role_allow {
            role_allow {
              id
              name
            }
            id
          }
          security_entities {
            id
            role_attribute {
              id
              value
            }
          }
        }
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class UpdatePasswordByAdministratorQuery extends Mutation {
  document = gql`
    mutation UpdatePasswordByAdministrator($id: String!, $password: String!, $Password_confirm: String!) {
      UpdatePasswordByAdministrator(id: $id, password: $password, Password_confirm: $Password_confirm) {
        error
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class ChangePassPersonal extends Mutation {
  document = gql`
    mutation UpdatePasswordByPersonal(
      $id: String!
      $password: String!
      $Password_confirm: String!
      $Password_old: String!
    ) {
      UpdatePasswordByPersonal(
        id: $id
        password: $password
        Password_confirm: $Password_confirm
        Password_old: $Password_old
      ) {
        error
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class GetPersonalsRolesByPersonalIDQuery extends Query<Response> {
  document = gql`
    query getPersonalsRolesByPersonalID($Personal_id: ID!) {
      getPersonalsRolesByPersonalID(Personal_id: $Personal_id) {
        error
        data {
          id
          Personal_id
          role_id
        }
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class DeletePersonalsRolesQuery extends Mutation {
  document = gql`
    mutation deletePersonalsRoles($id: String!) {
      deletePersonalsRoles(id: $id) {
        error
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class CreatePersonalsSecurityEntityQuery extends Mutation {
  document = gql`
    mutation createPersonalsSecurityEntity($request: RequestNewPersonalsSecurityEntity!) {
      createPersonalsSecurityEntity(input: $request) {
        error
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class CreatePersonalsAttributeQuery extends Mutation {
  document = gql`
    mutation createPersonalsAttribute($request: RequestNewPersonalsAttribute!) {
      createPersonalsAttribute(input: $request) {
        error
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class DeletePersonalsSecurityEntityQuery extends Mutation {
  document = gql`
    mutation deletePersonalsSecurityEntity($id: String!) {
      deletePersonalsSecurityEntity(id: $id) {
        error
        code
        type
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class DeletePersonalsAttributeQuery extends Mutation {
  document = gql`
    mutation deletePersonalsAttribute($id: String!) {
      deletePersonalsAttribute(id: $id) {
        error
        code
        type
        msg
      }
    }
  `;
}


@Injectable({
  providedIn: 'root',
})
export class GetPersonalByName extends Mutation {
  document = gql`
    query getPersonalByName($Personalname: String! $identification_number: String!) {
  getPersonalByName(Personalname: $Personalname identification_number:$identification_number) {
    error
    code
    data {
      id,
      Personalname
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
export class activeQueryPersonal extends Mutation {
  document = gql`
   mutation activePersonal($id: ID!) {
  activePersonal(id: $id) {
    error
    code
    data {
      id
      Personalname
      name
      last_name
      email_notifications
      identification_number
      identification_type
      status
      failed_attempts
      last_change_password
    }
    type
    msg
  }
}

  `;
}
