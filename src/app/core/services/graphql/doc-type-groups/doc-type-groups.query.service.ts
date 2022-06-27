import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Mutation, Query } from 'apollo-angular';
@Injectable({
  providedIn: 'root',
})
export class GetDoctypeGroupsByDoctypeNameQuery extends Query<Response> {
  document = gql`
    query getDoctypeGroupsByDoctypeName($doctype: String!) {
      getDoctypeGroupsByDoctypeName(doctype: $doctype) {
        error
        data {
          id
          project
          doc_types {
            name
            format
            url_path
            procedure
            entities {
              id
              is_unique
              attributes {
                id
                description
                tag_html
                type
                mask
                data_sets {
                  value
                  description
                  sequence
                }
                regex
                autofill
                min_length
                max_length
                validation
                cascading_datasets
                is_cipher
                required
                hidden
                disabled
              }
              project
              is_unique
            }
          }
        }
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class GetDoctypeFormatQuery extends Query<Response> {
  document = gql`
    query getDoctypeFormat {
      getDoctypeFormat(format: "frm") {
        error
        data {
          id
          code
          name
          url_path
          storage_id
          format
          autoname
          procedure
          doctypes_entities {
            id
            entities {
              id
              name
              is_unique
              attributes {
                id
                name
                description
                tag_html
                type
                mask
                min_length
                max_length
                validation
                field_types
                dataset
                required
                hidden
                disabled
                entities_id
                is_index
                sequence
                regex
                entities_attributes_dataset {
                  id
                  description
                  name
                }
                entities_attributes_autofills {
                  id
                  autofills {
                    id
                    name
                    description
                    outside
                    process
                  }
                  sequence
                  is_search
                }
                entities_attributes_cascading_dataset {
                  id
                  cascading_dataset {
                    id
                    name
                  }
                  sequence
                }
                min_length
                max_length
                validation
                field_types
                is_cipher
                required
                hidden
                disabled
              }
            }
          }
          tipo_soporte
          retencion_electronic
          retencion_ag
          retencion_ac
          class
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
export class GetDoctypeGroupQuery extends Query<Response> {
  document = gql`
    query getDoctypeGroup {
      getDoctypeGroup {
        error
        data {
          id
          name
          doctypes {
            id
            code
            name
            url_path
            storage_id
            format
            autoname
            tipo_soporte
            retencion_electronic
            retencion_ag
            retencion_ac
            retencion_ah
            final_disposition
            digitalizacion
            procedure
            class
            is_cipher
            doctypes_entities {
              id
              entities {
                id
                name
                is_unique
                attributes {
                  id
                  name
                  description
                  type
                  validation
                  required
                  mask
                  entities_attributes_dataset {
                    id
                    description
                    name
                    field_type
                    max_length
                    outside
                    process
                  }
                }
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
export class GetDoctypeByFormatAndProjectIDQuery extends Query<Response> {
  document = gql`
    query getDoctypeByFormatAndProjectID($format: String!, $project_id: String!) {
      getDoctypeByFormatAndProjectID(format: $format, project_id: $project_id) {
        error
        data {
          id
          code
          name
          url_path
          storage_id
          format
          autoname
          procedure
          doctypes_entities {
            id
            entities {
              id
              name
              is_unique
              attributes {
                id
                name
                description
                tag_html
                type
                mask
                min_length
                max_length
                validation
                field_types
                dataset
                required
                hidden
                disabled
                entities_id
                is_index
                sequence
                regex
                entities_attributes_dataset {
                  id
                  description
                  name
                }
                entities_attributes_autofills {
                  id
                  autofills {
                    id
                    name
                    description
                    outside
                    process
                  }
                  sequence
                  is_search
                }
                entities_attributes_cascading_dataset {
                  id
                  cascading_dataset {
                    id
                    name
                  }
                  sequence
                }
                min_length
                max_length
                validation
                field_types
                is_cipher
                required
                hidden
                disabled
              }
            }
          }
          tipo_soporte
          retencion_electronic
          retencion_ag
          retencion_ac
          class
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
export class GetDoctypeDashBoardsQuery extends Query<Response> {
  document = gql`
    query getDoctypeDashBoards {
      getDoctypeDashBoards {
        error
        data {
          id
          project
          doc_types {
            code
            name
            url_path
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
export class GetDoctypeReportsQuery extends Query<Response> {
  document = gql`
    query getDoctypeReports {
      getDoctypeReports {
        error
        type
        data {
          id
          project
          doc_types {
            code
            name
            url_path
            storage
            format
            type_support
            is_cipher
            procedure
            entities {
              id
              is_unique
              attributes {
                id
                description
                tag_html
                type
                mask
                data_sets {
                  value
                  description
                  sequence
                }
                autofill
                min_length
                max_length
                validation
                field_types
                cascading_datasets
                is_cipher
                required
                hidden
                disabled
              }
            }
          }
        }
        msg
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class GetDoctypeGroupsProjectRoleQuery extends Query<Response> {
  document = gql`
    query getDoctypeGroupsProjectRole {
      getDoctypeGroupsProjectRole {
        error
        data {
          id
          name
          doctypes {
            id
            code
            name
            url_path
            storage_id
            format
            autoname
            class
            is_cipher
            doctypes_entities {
              id
              name
              is_unique
              attributes {
                id
                name
                description
                tag_html
                type
                mask
                required
                entities_attributes_dataset {
                  id
                  name
                  description
                  field_type
                }
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
export class GetDocumentsByEntityValuesQuery extends Query<Response> {
  document = gql`
    query getDocumentsByEntityValues($entities: [NewEntityValue]!, $doctypes: [ID]) {
      getDocumentsByEntityValues(input: { doctypes: $doctypes, entities: $entities }) {
        error
        data {
          id
          auto_name
          batch
          status
          format
          locked
          doctype {
            id
            code
            name
            url_path
            storage_id
            format
            autoname
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
export class PublishDoctypeQuery extends Mutation {
  document = gql`
    mutation publishDoctype($doctype_id: String!, $procedure: String!) {
      publishDoctype(doctype_id: $doctype_id, procedure: $procedure) {
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
