import { Injectable } from '@angular/core';
import { Mutation, Query } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root',
})
export class GetFirstFileByDocumentIDQuery extends Query<Response> {
  document = gql`
    query getFirstFileByDocumentID($id: Int64!) {
      getFirstFileByDocumentID(DocumentID: $id) {
        error
        data {
          file_encode
          ext
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
export class GetFileByDocumentIDAndPageIDQuery extends Query<Response> {
  document = gql`
    query getFileByDocumentIDAndPageID($documentId: String!, $pageId: String!) {
      getFileByDocumentIDAndPageID(DocumentID: $documentId, PageID: $pageId) {
        error
        data {
          document_id
          page_id
          file_encode
          ext
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
export class CreateDocumentQuery extends Mutation {
  document = gql`
    mutation createDocument($newDocument: RequestNewDocument!) {
      createDocument(input: $newDocument) {
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
// mutation createDocument($newDocument: NewDocument!) {
//   createDocument(input: { data: $newDocument }) {
//     error
//     data {
//       id
//     }
//     code
//     type
//     msg
//   }
// }

@Injectable({
  providedIn: 'root',
})
export class GetValuesByDocumentIdQuery extends Query<Response> {
  document = gql`
    query getValuesByDocumentID($DocumentID: String!) {
      getValuesByDocumentID(DocumentID: $DocumentID) {
        error
        data {
          id
          entity
          attributes {
            name
            value
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
export class UpdateEntityToDocumentquery extends Mutation {
  document = gql`
    mutation updateEntityToDocument($requestUpdateEntitiesValues: RequestUpdateEntitiesValues!) {
      updateEntityToDocument(input: $requestUpdateEntitiesValues) {
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
export class NewEntityToDocumentQuery extends Mutation {
  document = gql`
    mutation NewEntityToDocument($requestNewEntitiesValues: RequestNewEntitiesValues!) {
      NewEntityToDocument(input: $requestNewEntitiesValues) {
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
export class DeleteEntityToDocumentQuery extends Mutation {
  document = gql`
    mutation deleteEntityToDocument($request: RequestDeleteEntitiesValues!) {
      deleteEntityToDocument(input: $request) {
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
export class GetDocumentByIDQuery extends Query<Response> {
  document = gql`
    query getDocumentByID($id: String!) {
      getDocumentByID(id: $id) {
        error
        data {
          id
          auto_name
          doctype {
            id
          }
          entities {
            entity {
              id
            }
            attributes_id
            attributes_value {
              name
              value
            }
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
