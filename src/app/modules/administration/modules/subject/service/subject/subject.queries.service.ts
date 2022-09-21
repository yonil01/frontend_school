import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Mutation, Query } from 'apollo-angular';
@Injectable({
  providedIn: 'root',
})
export class GetSubjectsQueryCpy extends Query<Response> {
  document = gql`
    query getSubjects {
      getSubjects {
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
export class GetSubjectsQuery extends Query<Response> {
  document = gql`
    query getSubjects {
      getSubjects {
        error
        data {
          id
          Subjectname
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
export class GetSubjectsByRolesAllowQuery extends Query<Response> {
  document = gql`
    query getSubjectsByRolesAllow {
      getSubjectsByRolesAllow {
        error
        data {
          id
          Subjectname
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
export class GetSubjectByIDQuery extends Query<Response> {
  document = gql`
    query getSubjectByID($id: String!) {
      getSubjectByID(id: $id) {
        error
        data {
          id
          Subjectname
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
export class CreateSubjectQuery extends Mutation {
  document = gql`
    mutation createSubject($rq: RequestNewSubject!) {
  createSubject(input: $rq) {
    error
    code
    data {
      id
      name
      Subjectname
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
export class CreateSubjectsRolesQuery extends Mutation {
  document = gql`
    mutation createSubjectsRoles($req: RequestNewSubjectsRoles!) {
      createSubjectsRoles(input: $req) {
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
export class UpdateSubjectQuery extends Mutation {
  document = gql`
    mutation updateSubject($rq: RequestUpdateSubject!) {
      updateSubject(input: $rq) {
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
export class DeleteSubjectQuery extends Mutation {
  document = gql`
    mutation deleteSubject($id: ID!) {
      deleteSubject(id: $id) {
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
export class BlockSubjectQuery extends Mutation {
  document = gql`
    mutation blockSubject($id: ID!) {
      blockSubject(id: $id) {
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
export class UnBlockSubjectQuery extends Mutation {
  document = gql`
    mutation unblockSubject($id: ID!) {
      unblockSubject(id: $id) {
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
export class LogoutSubjectQuery extends Mutation {
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
export class GetRolesAllowBySubjectQuery extends Query<Response> {
  document = gql`
    query getRolesAllowBySubject {
      getRolesAllowBySubject {
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
export class ChangePassSubject extends Mutation {
  document = gql`
    mutation UpdatePasswordBySubject(
      $id: String!
      $password: String!
      $Password_confirm: String!
      $Password_old: String!
    ) {
      UpdatePasswordBySubject(
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
export class GetSubjectsRolesBySubjectIDQuery extends Query<Response> {
  document = gql`
    query getSubjectsRolesBySubjectID($Subject_id: ID!) {
      getSubjectsRolesBySubjectID(Subject_id: $Subject_id) {
        error
        data {
          id
          Subject_id
          role_id
        }
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class DeleteSubjectsRolesQuery extends Mutation {
  document = gql`
    mutation deleteSubjectsRoles($id: String!) {
      deleteSubjectsRoles(id: $id) {
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
export class CreateSubjectsSecurityEntityQuery extends Mutation {
  document = gql`
    mutation createSubjectsSecurityEntity($request: RequestNewSubjectsSecurityEntity!) {
      createSubjectsSecurityEntity(input: $request) {
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
export class CreateSubjectsAttributeQuery extends Mutation {
  document = gql`
    mutation createSubjectsAttribute($request: RequestNewSubjectsAttribute!) {
      createSubjectsAttribute(input: $request) {
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
export class DeleteSubjectsSecurityEntityQuery extends Mutation {
  document = gql`
    mutation deleteSubjectsSecurityEntity($id: String!) {
      deleteSubjectsSecurityEntity(id: $id) {
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
export class DeleteSubjectsAttributeQuery extends Mutation {
  document = gql`
    mutation deleteSubjectsAttribute($id: String!) {
      deleteSubjectsAttribute(id: $id) {
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
export class GetSubjectByName extends Mutation {
  document = gql`
    query getSubjectByName($Subjectname: String! $identification_number: String!) {
  getSubjectByName(Subjectname: $Subjectname identification_number:$identification_number) {
    error
    code
    data {
      id,
      Subjectname
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
export class activeQuerySubject extends Mutation {
  document = gql`
   mutation activeSubject($id: ID!) {
  activeSubject(id: $id) {
    error
    code
    data {
      id
      Subjectname
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
