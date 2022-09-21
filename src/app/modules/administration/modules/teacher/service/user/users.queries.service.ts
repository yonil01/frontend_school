import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Mutation, Query } from 'apollo-angular';
@Injectable({
  providedIn: 'root',
})
export class GetTeacherQueryCpy extends Query<Response> {
  document = gql`
    query getTeacher {
      getTeacher {
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
export class GetTeacherQuery extends Query<Response> {
  document = gql`
    query getTeacher {
      getTeacher {
        error
        data {
          id
          username
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
export class GetTeacherByRolesAllowQuery extends Query<Response> {
  document = gql`
    query getTeacherByRolesAllow {
      getTeacherByRolesAllow {
        error
        data {
          id
          username
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
export class GetUserByIDQuery extends Query<Response> {
  document = gql`
    query getUserByID($id: String!) {
      getUserByID(id: $id) {
        error
        data {
          id
          username
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
export class CreateUserQuery extends Mutation {
  document = gql`
    mutation createUser($rq: RequestNewUser!) {
  createUser(input: $rq) {
    error
    code
    data {
      id
      name
      username
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
export class CreateTeacherRolesQuery extends Mutation {
  document = gql`
    mutation createTeacherRoles($req: RequestNewTeacherRoles!) {
      createTeacherRoles(input: $req) {
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
export class UpdateUserQuery extends Mutation {
  document = gql`
    mutation updateUser($rq: RequestUpdateUser!) {
      updateUser(input: $rq) {
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
export class DeleteUserQuery extends Mutation {
  document = gql`
    mutation deleteUser($id: ID!) {
      deleteUser(id: $id) {
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
export class BlockUserQuery extends Mutation {
  document = gql`
    mutation blockUser($id: ID!) {
      blockUser(id: $id) {
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
export class UnBlockUserQuery extends Mutation {
  document = gql`
    mutation unblockUser($id: ID!) {
      unblockUser(id: $id) {
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
export class LogoutUserQuery extends Mutation {
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
export class GetRolesAllowByUserQuery extends Query<Response> {
  document = gql`
    query getRolesAllowByUser {
      getRolesAllowByUser {
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
export class ChangePassUser extends Mutation {
  document = gql`
    mutation UpdatePasswordByUser(
      $id: String!
      $password: String!
      $Password_confirm: String!
      $Password_old: String!
    ) {
      UpdatePasswordByUser(
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
export class GetTeacherRolesByUserIDQuery extends Query<Response> {
  document = gql`
    query getTeacherRolesByUserID($user_id: ID!) {
      getTeacherRolesByUserID(user_id: $user_id) {
        error
        data {
          id
          user_id
          role_id
        }
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class DeleteTeacherRolesQuery extends Mutation {
  document = gql`
    mutation deleteTeacherRoles($id: String!) {
      deleteTeacherRoles(id: $id) {
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
export class CreateTeacherSecurityEntityQuery extends Mutation {
  document = gql`
    mutation createTeacherSecurityEntity($request: RequestNewTeacherSecurityEntity!) {
      createTeacherSecurityEntity(input: $request) {
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
export class CreateTeacherAttributeQuery extends Mutation {
  document = gql`
    mutation createTeacherAttribute($request: RequestNewTeacherAttribute!) {
      createTeacherAttribute(input: $request) {
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
export class DeleteTeacherSecurityEntityQuery extends Mutation {
  document = gql`
    mutation deleteTeacherSecurityEntity($id: String!) {
      deleteTeacherSecurityEntity(id: $id) {
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
export class DeleteTeacherAttributeQuery extends Mutation {
  document = gql`
    mutation deleteTeacherAttribute($id: String!) {
      deleteTeacherAttribute(id: $id) {
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
export class GetUserByName extends Mutation {
  document = gql`
    query getUserByName($username: String! $identification_number: String!) {
  getUserByName(username: $username identification_number:$identification_number) {
    error
    code
    data {
      id,
      username
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
export class activeQueryUser extends Mutation {
  document = gql`
   mutation activeUser($id: ID!) {
  activeUser(id: $id) {
    error
    code
    data {
      id
      username
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
