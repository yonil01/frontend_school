import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Mutation, Query } from 'apollo-angular';
@Injectable({
  providedIn: 'root',
})
export class GetClassroomsQueryCpy extends Query<Response> {
  document = gql`
    query getClassrooms {
      getClassrooms {
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
export class GetClassroomsQuery extends Query<Response> {
  document = gql`
    query getClassrooms {
      getClassrooms {
        error
        data {
          id
          Classroomname
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
export class GetClassroomsByRolesAllowQuery extends Query<Response> {
  document = gql`
    query getClassroomsByRolesAllow {
      getClassroomsByRolesAllow {
        error
        data {
          id
          Classroomname
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
export class GetClassroomByIDQuery extends Query<Response> {
  document = gql`
    query getClassroomByID($id: String!) {
      getClassroomByID(id: $id) {
        error
        data {
          id
          Classroomname
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
export class CreateClassroomQuery extends Mutation {
  document = gql`
    mutation createClassroom($rq: RequestNewClassroom!) {
  createClassroom(input: $rq) {
    error
    code
    data {
      id
      name
      Classroomname
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
export class CreateClassroomsRolesQuery extends Mutation {
  document = gql`
    mutation createClassroomsRoles($req: RequestNewClassroomsRoles!) {
      createClassroomsRoles(input: $req) {
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
export class UpdateClassroomQuery extends Mutation {
  document = gql`
    mutation updateClassroom($rq: RequestUpdateClassroom!) {
      updateClassroom(input: $rq) {
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
export class DeleteClassroomQuery extends Mutation {
  document = gql`
    mutation deleteClassroom($id: ID!) {
      deleteClassroom(id: $id) {
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
export class BlockClassroomQuery extends Mutation {
  document = gql`
    mutation blockClassroom($id: ID!) {
      blockClassroom(id: $id) {
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
export class UnBlockClassroomQuery extends Mutation {
  document = gql`
    mutation unblockClassroom($id: ID!) {
      unblockClassroom(id: $id) {
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
export class LogoutClassroomQuery extends Mutation {
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
export class GetRolesAllowByClassroomQuery extends Query<Response> {
  document = gql`
    query getRolesAllowByClassroom {
      getRolesAllowByClassroom {
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
export class ChangePassClassroom extends Mutation {
  document = gql`
    mutation UpdatePasswordByClassroom(
      $id: String!
      $password: String!
      $Password_confirm: String!
      $Password_old: String!
    ) {
      UpdatePasswordByClassroom(
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
export class GetClassroomsRolesByClassroomIDQuery extends Query<Response> {
  document = gql`
    query getClassroomsRolesByClassroomID($Classroom_id: ID!) {
      getClassroomsRolesByClassroomID(Classroom_id: $Classroom_id) {
        error
        data {
          id
          Classroom_id
          role_id
        }
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class DeleteClassroomsRolesQuery extends Mutation {
  document = gql`
    mutation deleteClassroomsRoles($id: String!) {
      deleteClassroomsRoles(id: $id) {
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
export class CreateClassroomsSecurityEntityQuery extends Mutation {
  document = gql`
    mutation createClassroomsSecurityEntity($request: RequestNewClassroomsSecurityEntity!) {
      createClassroomsSecurityEntity(input: $request) {
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
export class CreateClassroomsAttributeQuery extends Mutation {
  document = gql`
    mutation createClassroomsAttribute($request: RequestNewClassroomsAttribute!) {
      createClassroomsAttribute(input: $request) {
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
export class DeleteClassroomsSecurityEntityQuery extends Mutation {
  document = gql`
    mutation deleteClassroomsSecurityEntity($id: String!) {
      deleteClassroomsSecurityEntity(id: $id) {
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
export class DeleteClassroomsAttributeQuery extends Mutation {
  document = gql`
    mutation deleteClassroomsAttribute($id: String!) {
      deleteClassroomsAttribute(id: $id) {
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
export class GetClassroomByName extends Mutation {
  document = gql`
    query getClassroomByName($Classroomname: String! $identification_number: String!) {
  getClassroomByName(Classroomname: $Classroomname identification_number:$identification_number) {
    error
    code
    data {
      id,
      Classroomname
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
export class activeQueryClassroom extends Mutation {
  document = gql`
   mutation activeClassroom($id: ID!) {
  activeClassroom(id: $id) {
    error
    code
    data {
      id
      Classroomname
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
