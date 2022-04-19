import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Mutation, Query } from 'apollo-angular';
import {Response} from "@app/core/models";

@Injectable({
  providedIn: 'root',
})
export class GetAttributeCascadingDatasetsQuery extends Query<Response> {
  document = gql`
    query getAttributeCascadingDatasets {
      getAttributeCascadingDatasets {
        error
        data {
          id
          cascading_dataset {
            id
            name
          }
          attribute {
            id
            name
          }
          sequence
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
export class CreateAttributeCascadingDatasetQuery extends Mutation {
  document = gql`
    mutation createAttributeCascadingDataset($rq: RequestNewAttributeCascadingDataset!) {
      createAttributeCascadingDataset(input: $rq) {
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
export class UpdateAttributeCascadingDatasetQuery extends Mutation {
  document = gql`
    mutation updateAttributeCascadingDataset($rq: RequesUpdateAttributeCascadingDataset!) {
      updateAttributeCascadingDataset(input: $rq) {
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
export class DeleteAttributeCascadingDatasetQuery extends Mutation {
  document = gql`
    mutation deleteAttributeCascadingDataset($rq: RequestDeleteAttributeCascadingDataset!) {
      deleteAttributeCascadingDataset(input: $rq) {
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
export class GetCascadingDatasetValueByIdAttributeQuery extends Query<Response> {
  document = gql`
    query getCascadingDatasetValueByIdAttribute(
      $cascading_dataset_id: ID!
      $attribute_id: ID!
      $attribute_id_value: ID
      $value: String
    ) {
      getCascadingDatasetValueByIdAttribute(
        cascading_dataset_id: $cascading_dataset_id
        attribute_id: $attribute_id
        attribute_id_value: $attribute_id_value
        value: $value
      ) {
        error
        code
        data {
          cascading_dataset_id
          cascading_dataset_response
        }
        type
        msg
      }
    }
  `;
}
