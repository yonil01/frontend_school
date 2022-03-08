import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Mutation, Query } from 'apollo-angular';
import { Response } from "@app/core/models";

@Injectable({
  providedIn: 'root',
})
export class GetEntitiesByProjectQuery extends Query<Response> {
  document = gql`
    query getEntitiesByProject($project: String!) {
      getEntitiesByProject(project: $project) {
        error
        data {
          id
          name
          is_unique
          project {
            id
          }
          attributes {
            id
            entities_id
            name
            description
            tag_html
            type
            mask
            min_length
            max_length
            sequence
            regex
            validation
            field_types
            dataset
            is_cipher
            required
            hidden
            disabled
            is_index
            entities_attributes_dataset {
              id
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
export class GetAttributesByProjectQuery extends Query<Response> {
  document = gql`
    query getEntitiesByProject($project: String!) {
      getEntitiesByProject(project: $project) {
        error
        code
        data {
          attributes {
            id
          }
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

@Injectable({
  providedIn: 'root',
})
export class GetEntityByIDQuery extends Query<Response> {
  document = gql`
    query getEntityByID($id: String!) {
      getEntityByID(id: $id) {
        error
        data {
          id
          attributes {
            id
          }
          project
          is_unique
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
export class CreateEntityQuery extends Mutation {
  document = gql`
    mutation createEntities($requestEntity: RequestNewEntities!) {
      createEntities(input: $requestEntity) {
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
export class UpdateEntityQuery extends Mutation {
  document = gql`
    mutation updateEntities($requestEntity: RequesUpdateEntities!) {
      updateEntities(input: $requestEntity) {
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
export class DeleteEntityQuery extends Mutation {
  document = gql`
    mutation deleteEntities($id: String!) {
      deleteEntities(id: $id) {
        error
        code
        data {
          id
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
export class CreateAttributeQuery extends Mutation {
  document = gql`
    mutation createAttribute($request: RequestNewAttribute!) {
      createAttribute(input: $request) {
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
export class UpdateAttributeQuery extends Mutation {
  document = gql`
    mutation updateAttribute($request: RequesUpdateAttribute!) {
      updateAttribute(input: $request) {
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
export class DeleteAttributeQuery extends Mutation {
  document = gql`
    mutation deleteAttribute($id: String!) {
      deleteAttribute(id: $id) {
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
export class CreateAttributeDatasetQuery extends Mutation {
  document = gql`
    mutation createAttributeDataset($request: RequestNewAttributeDataset!) {
      createAttributeDataset(input: $request) {
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
export class DeleteAttributeDatasetByAttIDAndDatasetIDQuery extends Mutation {
  document = gql`
    mutation deleteAttributeDatasetByAttIDAndDatasetID($attribute_id: String!, $dataset_id: String!) {
      deleteAttributeDatasetByAttIDAndDatasetID(attribute_id: $attribute_id, dataset_id: $dataset_id) {
        error
        code
        type
        msg
      }
    }
  `;
}

// CRUD Cascading Dataset
@Injectable({
  providedIn: 'root',
})
export class CreateCascadingDatasetsQuery extends Mutation {
  document = gql`
    mutation createCascadingDatasets($rq: RequestNewCascadingDatasets) {
      createCascadingDatasets(input: $rq) {
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
export class UpdateCascadingDatasetsQuery extends Mutation {
  document = gql`
    mutation updateCascadingDatasets($rq: RequesUpdateCascadingDatasets!) {
      updateCascadingDatasets(input: $rq) {
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
export class DeleteCascadingDatasetsQuery extends Mutation {
  document = gql`
    mutation deleteCascadingDatasets($id: String!) {
      deleteCascadingDatasets(id: $id) {
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
export class GetCascadingDatasetsQuery extends Query<Response> {
  document = gql`
    query getCascadingDatasets {
      getCascadingDatasets {
        error
        data {
          id
          name
          description
          outside
          process
          entities_id
        }
        code
        type
        msg
      }
    }
  `;
}

/**
 * GQL para obtener todas las entidades
 */
@Injectable({
  providedIn: 'root',
})
export class GetEntitiesQueryE extends Query<Response> {
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

/**
 * GQL para obtener todos los atributos
 */
@Injectable({
  providedIn: 'root',
})
export class GetAttributesQuery extends Query<Response> {
  document = gql`
    query getAttributes {
      getAttributes {
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
