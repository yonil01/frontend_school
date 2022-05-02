import {Injectable} from '@angular/core';
import gql from 'graphql-tag';
import {Mutation, Query} from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class CreateRequiredMutation extends Mutation {
  document = gql`
    mutation createRequired($requestRequired: RequestNewRequired!) {
      createRequired(input: $requestRequired) {
        error
        data {
          id
          name
          version
          is_active
          required_doctypes {
            id
            doctype_related_id
            is_required
            required_attributes {
              id
              entity_id
              attribute_id
              comparison_symbol {
                Id
                name
              }
              value
              preposition {
                Id
                name
              }
            }
          }
          required_attributes_common {
            id
            required_id
            attribute_id
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
export class UpdateRequiredMutation extends Mutation {
  document = gql`
    mutation updateRequired($requestUpdateRequired: RequestUpdateRequired!) {
      updateRequired(input: $requestUpdateRequired) {
        error
        data {
          id
          name
          version
          is_active
          required_doctypes {
            id
            doctype_related_id
            is_required
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
export class DeleteRequiredMutation extends Mutation {
  document = gql`
    mutation deleteRequired($id: ID!) {
      deleteRequired(id: $id) {
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
export class CreateRequiredDoctypes extends Mutation {
  document = gql`
    mutation createRequiredDoctypes($requestRequiredDoctypes: RequestNewRequiredDoctypes!) {
      createRequiredDoctypes(input: $requestRequiredDoctypes) {
        error
        data {
          id
          doctype_related_id
          is_required
          required_attributes {
            id
            entity_id
            attribute_id
            comparison_symbol {
              Id
              name
            }
            value
            preposition {
              Id
              name
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
export class UpdateRequiredDoctypes extends Mutation {
  document = gql`
    mutation updateRequiredDoctypes($requestUpdateRequiredDoctypes: RequestUpdateRequiredDoctypes!) {
      updateRequiredDoctypes(input: $requestUpdateRequiredDoctypes) {
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
export class DeleteRequiredDoctypes extends Mutation {
  document = gql`
    mutation deleteRequiredDoctypes($id: ID!) {
      deleteRequiredDoctypes(id: $id) {
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
export class CreateRequiredAttributesCommon extends Mutation {
  document = gql`
    mutation createRequiredAttributeCommon($request: RequestNewRequiredAttributeCommon!) {
      createRequiredAttributeCommon(input: $request) {
        error
        data {
          id
          required_id
          attribute_id
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
export class UpdateRequiredAttributesCommon extends Mutation {
  document = gql`
    mutation updateRequiredAttributeCommons($request: RequestUpdateRequiredAttributeCommon!) {
      updateRequiredAttributeCommons(input: $request) {
        error
        data {
          id
          required_id
          attribute_id
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
export class DeleteRequiredAttributesCommon extends Mutation {
  document = gql`
    mutation deleteRequiredAttributeCommons($id: ID!) {
      deleteRequiredAttributeCommons(id: $id) {
        error
        data {
          id
          required_id
          attribute_id
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
export class CreateRequiredAttributes extends Mutation {
  document = gql`
    mutation createRequiredAttributes($request: RequestNewRequiredAttribute!) {
      createRequiredAttributes(input: $request) {
        error
        data {
          id
          entity_id
          attribute_id
          comparison_symbol {
            Id
            name
          }
          value
          preposition {
            Id
            name
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
export class UpdateRequiredAttributes extends Mutation {
  document = gql`
    mutation updateRequiredAttributes($request: RequestUpdateRequiredAttribute!) {
      updateRequiredAttributes(input: $request) {
        error
        data {
          id
          entity_id
          attribute_id
          comparison_symbol {
            Id
            name
          }
          value
          preposition {
            Id
            name
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
export class DeleteRequiredAttributes extends Mutation {
  document = gql`
    mutation deleteRequiredAttributes($id: ID!) {
      deleteRequiredAttributes(id: $id) {
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
