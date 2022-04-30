import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Mutation, Query } from 'apollo-angular';
@Injectable({
  providedIn: 'root',
})
export class GetUsersQueryCpy extends Query<Response> {
  document = gql`
    query getUsers {
      getUsers {
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
export class GetUsersQuery extends Query<Response> {
  document = gql`
    query getUsers {
      getUsers {
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
export class GetUsersByRolesAllowQuery extends Query<Response> {
  document = gql`
    query getUsersByRolesAllow {
      getUsersByRolesAllow {
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
      identification_number
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
export class CreateUsersRolesQuery extends Mutation {
  document = gql`
    mutation createUsersRoles($req: RequestNewUsersRoles!) {
      createUsersRoles(input: $req) {
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
export class GetRoles extends Query<Response> {
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
}

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
export class GetUsersRolesByUserIDQuery extends Query<Response> {
  document = gql`
    query getUsersRolesByUserID($user_id: ID!) {
      getUsersRolesByUserID(user_id: $user_id) {
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
export class DeleteUsersRolesQuery extends Mutation {
  document = gql`
    mutation deleteUsersRoles($id: String!) {
      deleteUsersRoles(id: $id) {
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
export class CreateUsersSecurityEntityQuery extends Mutation {
  document = gql`
    mutation createUsersSecurityEntity($request: RequestNewUsersSecurityEntity!) {
      createUsersSecurityEntity(input: $request) {
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
export class CreateUsersAttributeQuery extends Mutation {
  document = gql`
    mutation createUsersAttribute($request: RequestNewUsersAttribute!) {
      createUsersAttribute(input: $request) {
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
export class DeleteUsersSecurityEntityQuery extends Mutation {
  document = gql`
    mutation deleteUsersSecurityEntity($id: String!) {
      deleteUsersSecurityEntity(id: $id) {
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
export class DeleteUsersAttributeQuery extends Mutation {
  document = gql`
    mutation deleteUsersAttribute($id: String!) {
      deleteUsersAttribute(id: $id) {
        error
        code
        type
        msg
      }
    }
  `;
}
