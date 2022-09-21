import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Mutation, Query } from 'apollo-angular';
@Injectable({
  providedIn: 'root',
})
export class GetPaymentsQueryCpy extends Query<Response> {
  document = gql`
    query getPayments {
      getPayments {
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
export class GetPaymentsQuery extends Query<Response> {
  document = gql`
    query getPayments {
      getPayments {
        error
        data {
          id
          Paymentname
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
export class GetPaymentsByRolesAllowQuery extends Query<Response> {
  document = gql`
    query getPaymentsByRolesAllow {
      getPaymentsByRolesAllow {
        error
        data {
          id
          Paymentname
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
export class GetPaymentByIDQuery extends Query<Response> {
  document = gql`
    query getPaymentByID($id: String!) {
      getPaymentByID(id: $id) {
        error
        data {
          id
          Paymentname
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
export class CreatePaymentQuery extends Mutation {
  document = gql`
    mutation createPayment($rq: RequestNewPayment!) {
  createPayment(input: $rq) {
    error
    code
    data {
      id
      name
      Paymentname
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
export class CreatePaymentsRolesQuery extends Mutation {
  document = gql`
    mutation createPaymentsRoles($req: RequestNewPaymentsRoles!) {
      createPaymentsRoles(input: $req) {
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
export class UpdatePaymentQuery extends Mutation {
  document = gql`
    mutation updatePayment($rq: RequestUpdatePayment!) {
      updatePayment(input: $rq) {
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
export class DeletePaymentQuery extends Mutation {
  document = gql`
    mutation deletePayment($id: ID!) {
      deletePayment(id: $id) {
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
export class BlockPaymentQuery extends Mutation {
  document = gql`
    mutation blockPayment($id: ID!) {
      blockPayment(id: $id) {
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
export class UnBlockPaymentQuery extends Mutation {
  document = gql`
    mutation unblockPayment($id: ID!) {
      unblockPayment(id: $id) {
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
export class LogoutPaymentQuery extends Mutation {
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
export class GetRolesAllowByPaymentQuery extends Query<Response> {
  document = gql`
    query getRolesAllowByPayment {
      getRolesAllowByPayment {
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
export class ChangePassPayment extends Mutation {
  document = gql`
    mutation UpdatePasswordByPayment(
      $id: String!
      $password: String!
      $Password_confirm: String!
      $Password_old: String!
    ) {
      UpdatePasswordByPayment(
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
export class GetPaymentsRolesByPaymentIDQuery extends Query<Response> {
  document = gql`
    query getPaymentsRolesByPaymentID($Payment_id: ID!) {
      getPaymentsRolesByPaymentID(Payment_id: $Payment_id) {
        error
        data {
          id
          Payment_id
          role_id
        }
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class DeletePaymentsRolesQuery extends Mutation {
  document = gql`
    mutation deletePaymentsRoles($id: String!) {
      deletePaymentsRoles(id: $id) {
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
export class CreatePaymentsSecurityEntityQuery extends Mutation {
  document = gql`
    mutation createPaymentsSecurityEntity($request: RequestNewPaymentsSecurityEntity!) {
      createPaymentsSecurityEntity(input: $request) {
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
export class CreatePaymentsAttributeQuery extends Mutation {
  document = gql`
    mutation createPaymentsAttribute($request: RequestNewPaymentsAttribute!) {
      createPaymentsAttribute(input: $request) {
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
export class DeletePaymentsSecurityEntityQuery extends Mutation {
  document = gql`
    mutation deletePaymentsSecurityEntity($id: String!) {
      deletePaymentsSecurityEntity(id: $id) {
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
export class DeletePaymentsAttributeQuery extends Mutation {
  document = gql`
    mutation deletePaymentsAttribute($id: String!) {
      deletePaymentsAttribute(id: $id) {
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
export class GetPaymentByName extends Mutation {
  document = gql`
    query getPaymentByName($Paymentname: String! $identification_number: String!) {
  getPaymentByName(Paymentname: $Paymentname identification_number:$identification_number) {
    error
    code
    data {
      id,
      Paymentname
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
export class activeQueryPayment extends Mutation {
  document = gql`
   mutation activePayment($id: ID!) {
  activePayment(id: $id) {
    error
    code
    data {
      id
      Paymentname
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
