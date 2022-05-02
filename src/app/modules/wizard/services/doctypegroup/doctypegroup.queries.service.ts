import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Mutation, Query } from 'apollo-angular';
import { Response } from '@app/core/models';

@Injectable({
  providedIn: 'root',
})
export class CreateDoctypeGroupQuery extends Mutation {
  document = gql`
    mutation createDoctypeGroup($rq: RequestNewDoctypeGroup!) {
      createDoctypeGroup(input: $rq) {
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
export class UpdateDoctypeGroupQuery extends Mutation {
  document = gql`
    mutation updateDoctypeGroup($rq: RequesUpdateDoctypeGroup!) {
      updateDoctypeGroup(input: $rq) {
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
export class DeleteDoctypeGroupsMutation extends Mutation {
  document = gql`
    mutation deleteDoctypeGroup($rq: String!) {
      deleteDoctypeGroup(id: $rq) {
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
export class CreateDoctypeMutation extends Mutation {
  document = gql`
    mutation createDoctype($rq: RequestNewDoctype!) {
      createDoctype(input: $rq) {
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
export class UpdateDoctypeMutation extends Mutation {
  document = gql`
    mutation updateDoctype($rq: RequesUpdateDoctype!) {
      updateDoctype(input: $rq) {
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
export class DeleteDoctypeMutation extends Mutation {
  document = gql`
    mutation deleteDoctype($id: String!) {
      deleteDoctype(id: $id) {
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
export class CreateDoctypeEntitiesMutation extends Mutation {
  document = gql`
    mutation createDoctypesEntities($rq: RequestNewDoctypesEntities!) {
      createDoctypesEntities(input: $rq) {
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
export class DeleteDoctypeEntitiesByDtIDMutation extends Mutation {
  document = gql`
    mutation deleteDoctypeEntitiesByDtID($doctype_id: String!) {
      deleteDoctypeEntitiesByDtID(doctype_id: $doctype_id) {
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
export class DeleteDoctypeEntitiesById extends Mutation {
  document = gql`
    mutation deleteDoctypeEntities($id: String!) {
      deleteDoctypeEntities(id: $id) {
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
export class GetEntitiesByIDQuery extends Query<Response> {
  document = gql`
    query getEntitiesByID($id: String!) {
      getEntitiesByID(id: $id) {
        error
        data {
          id
          name
          attributes {
            id
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
export class QueryGetMaxCodDoctype extends Query<Response> {
  document = gql`
    query getMaxCodDoctype {
      getMaxCodDoctype {
        error
        data
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
export class GetStorageQuery extends Query<Response> {
  document = gql`
    query getStorage {
      getStorage {
        error
        data {
          id
          name
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
export class GetDoctypeGroupsProjectQuery extends Query<Response> {
  document = gql`
    query getDoctypeGroupsProject {
      getDoctypeGroupsProject {
        error
        data {
          id
          name
          project {
            id
            name
            description
          }
          doctypes {
            id
            code
            name
            doctypes_entities {
              id
              sequence
              entities {
                id
                name
                attributes {
                  id
                  name
                  description
                }
              }
            }
            doctypes_groups_id
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
export class GetDoctypeGroupsByProjectIDQuery extends Query<Response> {
  document = gql`
    query getDoctypeGroupsByProjectID($project_id: String!) {
      getDoctypeGroupsByProjectID(project_id: $project_id) {
        error
        data {
          id
          name
          project {
            id
            name
            description
          }
          doctypes {
            id
            code
            name
            doctypes_entities {
              id
              sequence
              entities {
                id
                name
                attributes {
                  id
                  name
                  description
                }
              }
            }
            doctypes_groups_id
            url_path
            storage_id
            format
            required {
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
export class GetDoctypeByIDQuery extends Query<Response> {
  document = gql`
    query getDoctypeByID($id: String!) {
      getDoctypeByID(id: $id) {
        error
        data {
          id
          required {
             id
             name
             version
             is_active
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
export class GetDoctypeQuery extends Query<Response> {
  document = gql`
    query getDoctype{
      getDoctype {
        error
        data {
          id
          name
        }
        code
        type
        msg
      }
    }
  `;
}
