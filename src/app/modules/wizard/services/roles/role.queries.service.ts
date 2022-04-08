import {Injectable} from '@angular/core';
import gql from 'graphql-tag';
import {Mutation, Query} from 'apollo-angular';
import {Response} from '@app/core/models';

@Injectable({
  providedIn: 'root',
})
export class GetRolesQuery extends Query<Response> {
  document = gql`
    query getRoles {
      getRoles {
        error
        data {
          id
          name
          description
          sessions_allowed
          see_all_users
          security_entities {
            id
            entity {
              id
              name
            }
            role_attribute {
              id
              value
              attribute {
                id
                name
                description
                entities_id
              }
            }
          }
          roles_doc_types {
            id
            doctype {
              id
              code
              name
              url_path
              storage_id
              format
              doctypes_entities {
                id
                entities {
                  id
                  name
                  attributes {
                    id
                    name
                    description
                  }
                }
                sequence
              }
              doctypes_groups_id
            }
          }
          role_elements {
            id
            element {
              id
              name
              description
              url_back
              component_id
            }
          }
          password_policy {
            id
            days_pass_valid
            max_length
            min_length
            store_pass_not_repeated
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
          date_disallowed {
            id
            description
            begins_at
            ends_at
          }
          role_allow {
            id
            role_allow {
              id
              name
              description
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
export class GetRolesByProjectIDQuery extends Query<Response> {
  document = gql`
    query getRolesByProjectID($project_id: String!) {
      getRolesByProjectID(project_id: $project_id) {
        error
        data {
          id
          name
          description
          sessions_allowed
          see_all_users
          projects
          {
            id
            project {
              id
            }
          }
          security_entities {
            id
            entity {
              id
              name
            }
            role_attribute {
              id
              value
              attribute {
                id
                name
                description
                entities_id
              }
            }
          }
          roles_doc_types {
            id
            doctype {
              id
              code
              name
              url_path
              storage_id
              format
              doctypes_entities {
                id
                entities {
                  id
                  name
                  attributes {
                    id
                    name
                    description
                  }
                }
                sequence
              }
              doctypes_groups_id
            }
          }
          role_elements {
            id
            element {
              id
              name
              description
              url_back
              component_id
            }
          }
          password_policy {
            id
            days_pass_valid
            max_length
            min_length
            store_pass_not_repeated
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
          date_disallowed {
            id
            description
            begins_at
            ends_at
          }
          role_allow {
            id
            role_allow {
              id
              name
              description
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

// CRUD ROL PROJECT
@Injectable({
  providedIn: 'root',
})
export class CreateRoleProjectMutation extends Mutation {
  document = gql`
    mutation createRolesProject($rq: RequestNewRolesProject!) {
      createRolesProject(input: $rq) {
        error
        data {
          id
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
export class DeleteRoleProjectMutation extends Mutation {
  document = gql`
    mutation deleteRolesProject($rq: ID!) {
      deleteRolesProject(input: $rq) {
        error
        data {
          id
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
export class GetRolesProjectByIDQuery extends Query<Response> {
  document = gql`
    query getRolesProjectByID($id: ID!) {
      getRolesProjectByID(id: $id) {
        error
        data {
          id
          project {
            id
            name
            description
            department
            email
            phone
            product_owner
            customers_id
            created_at
            updated_at
          }
          created_at
          updated_at
        }
        code
        type
        msg
      }
    }
  `;
}

// CRUD ROL

@Injectable({
  providedIn: 'root',
})
export class CreateRoleMutation extends Mutation {
  document = gql`
    mutation createRole($rq: RequestNewRole!) {
      createRole(input: $rq) {
        error
        data {
          id
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
export class UpdateRoleMutation extends Mutation {
  document = gql`
    mutation updateRole($rq: RequestUpdateRole!) {
      updateRole(input: $rq) {
        error
        data {
          id
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
export class DeleteRoleMutation extends Mutation {
  document = gql`
    mutation deleteRole($id: ID!) {
      deleteRole(id: $id) {
        error
        data {
          id
        }
        code
        type
        msg
      }
    }
  `;
}

// CRUD ROLDOCTYPE

@Injectable({
  providedIn: 'root',
})
export class GetRolesDoctypeQuery extends Query<Response> {
  document = gql`
    query getRolesDoctype {
      getRolesDoctype {
        error
        data {
          id
          doctype {
            id
            code
            name
            doctypes_groups_id
            doctypes_entities {
              id
              entities {
                id
                name
                attributes {
                  id
                  name
                  description
                }
              }
              sequence
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
export class GetRoleById extends Query<Response> {
  document = gql`
    query getRolesDoctype {
      getRolesDoctype {
        error
        data {
          id
          doctype {
            id
            name
            description
            sessions_allowed
            role_allow {
              id
              role_allow {

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
export class CreateRolesDoctypeMutation extends Mutation {
  document = gql`
    mutation createRolesDoctypes($rq: RequestNewRolesDoctypes!) {
      createRolesDoctypes(input: $rq) {
        error
        data {
          id
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
export class DeleteRolesDoctypeMutation extends Mutation {
  document = gql`
    mutation deleteRolesDoctypes($id: [ID!]!) {
      deleteRolesDoctypes(ids: $id) {
        error
        data {
          id
        }
        code
        type
        msg
      }
    }
  `;
}

// CRUD PasswordPolicy
@Injectable({
  providedIn: 'root',
})
export class CreateRolesPasswordPolicyMutation extends Mutation {
  document = gql`
    mutation createRolesPasswordPolicy($rq: RequestNewRolesPasswordPolicy!) {
      createRolesPasswordPolicy(input: $rq) {
        error
        data {
          id
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
export class UpdateRolesPasswordPolicyMutation extends Mutation {
  document = gql`
    mutation updateRolesPasswordPolicy($rq: RequestUpdateRolesPasswordPolicy!) {
      updateRolesPasswordPolicy(input: $rq) {
        error
        data {
          id
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
export class DeleteRolesPasswordPolicyMutation extends Mutation {
  document = gql`
    mutation deleteRolesPasswordPolicy($id: ID!) {
      deleteRolesPasswordPolicy(id: $id) {
        error
        data {
          id
        }
        code
        type
        msg
      }
    }
  `;
}

// CRUD Date Disallowed
@Injectable({
  providedIn: 'root',
})
export class CreateRolesDateDisallowedMutation extends Mutation {
  document = gql`
    mutation createRolesDateDisallowed($rq: RequestNewRolesDateDisallowed!) {
      createRolesDateDisallowed(input: $rq) {
        error
        data {
          id
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
export class UpdateRolesDateDisallowedMutation extends Mutation {
  document = gql`
    mutation updateRolesDateDisallowed($rq: RequestUpdateRolesDateDisallowed!) {
      updateRolesDateDisallowed(input: $rq) {
        error
        data {
          id
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
export class DeleteRolesDateDisallowedMutation extends Mutation {
  document = gql`
    mutation deleteRolesDateDisallowed($id: ID!) {
      deleteRolesDateDisallowed(id: $id) {
        error
        data {
          id
        }
        code
        type
        msg
      }
    }
  `;
}

// CRUD Elements
@Injectable({
  providedIn: 'root',
})
export class GetRolesElementQuery extends Query<Response> {
  document = gql`
    query getRolesElement {
      getRolesElement {
        error
        data {
          id
          element {
            id
            name
            description
            url_back
            component_id
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
export class CreateRolesElementMutation extends Mutation {
  document = gql`
    mutation createRolesElement($rq: RequestNewRolesElement!) {
      createRolesElement(input: $rq) {
        error
        data {
          id
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
export class DeleteRolesElementMutation extends Mutation {
  document = gql`
    mutation deleteRolesElement($id: ID!) {
      deleteRolesElement(id: $id) {
        error
        data {
          id
        }
        code
        type
        msg
      }
    }
  `;
}

// CRUD Role Allow
@Injectable({
  providedIn: 'root',
})
export class CreateRolesAllowMutation extends Mutation {
  document = gql`
    mutation createRolesAlows($rq: RequestNewRolesAllows!) {
      createRolesAllows(input: $rq) {
        error
        data {
          id
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
export class DeleteRolesAllowMutation extends Mutation {
  document = gql`
    mutation deleteRolesAllows($id: [ID!]!) {
      deleteRolesAllows(ids: $id) {
        error
        data {
          id
        }
        code
        type
        msg
      }
    }
  `;
}

// CRUD Role Security Entities
@Injectable({
  providedIn: 'root',
})
export class CreateRolesSecurityEntityMutation extends Mutation {
  document = gql`
    mutation createRolesSecurityEntity($rq: RequestNewRolesSecurityEntity!) {
      createRolesSecurityEntity(input: $rq) {
        error
        data {
          id
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
export class DeleteRolesSecurityEntityMutation extends Mutation {
  document = gql`
    mutation deleteRolesSecurityEntity($id: ID!) {
      deleteRolesSecurityEntity(id: $id) {
        error
        data {
          id
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
export class CreateRolesAttributeMutation extends Mutation {
  document = gql`
    mutation createRolesAttribute($rq: RequestNewRolesAttribute!) {
      createRolesAttribute(input: $rq) {
        error
        data {
          id
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
export class UpdateRolesAttributeMutation extends Mutation {
  document = gql`
    mutation updateRolesAttribute($rq: RequestUpdateRolesAttribute!) {
      updateRolesAttribute(input: $rq) {
        error
        data {
          id
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
export class DeleteRolesAttributeMutation extends Mutation {
  document = gql`
    mutation deleteRolesAttribute($id: ID!) {
      deleteRolesAttribute(id: $id) {
        error
        data {
          id
        }
        code
        type
        msg
      }
    }
  `;
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
        data {
          id
          name
          project {
            id
            name
          }
          attributes {
            id
            name
            description
          }
        }
        code
        type
        msg
      }
    }
  `;
}

// Consulta para crear los Elementos en la pestaña privilegios
@Injectable({
  providedIn: 'root',
})
export class GetModulesQuery extends Query<Response> {
  document = gql`
    query getModules {
      getModules {
        error
        data {
          id
          name
          description
          class
          components {
            id
            name
            url_front
            class
            module_id
            elements {
              id
              name
              description
              url_back
              component_id
            }
          }
        }
      }
    }
  `;
}
