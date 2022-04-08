import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {map} from 'rxjs/operators';
import {Response, Document, EntityValue} from '@app/core/models';
import {Observable} from 'rxjs';
import {
  CreateDocumentQuery,
  GetFirstFileByDocumentIDQuery,
  GetFileByDocumentIDAndPageIDQuery,
  GetValuesByDocumentIdQuery,
  UpdateEntityToDocumentquery,
  NewEntityToDocumentQuery,
  GetDocumentByIDQuery,
  DeleteEntityToDocumentQuery,
} from './document.query.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  constructor(
    private apollo: Apollo,
    private createDocumentQuery: CreateDocumentQuery,
    private getFirstFileByDocumentIDQuery: GetFirstFileByDocumentIDQuery,
    private getFileByDocumentIDAndPageIDQuery: GetFileByDocumentIDAndPageIDQuery,
    private getValuesByDocumentIdQuery: GetValuesByDocumentIdQuery,
    private updateEntityToDocumentQuery: UpdateEntityToDocumentquery,
    private newEntityToDocumentQuery: NewEntityToDocumentQuery,
    private getDocumentByIdQuery: GetDocumentByIDQuery,
    private deleteEntityToDocumentQuery: DeleteEntityToDocumentQuery,
  ) {
  }

  getDocumentByID(id: string): Observable<Response> {
    return this.getFirstFileByDocumentIDQuery
      .watch({
        id: id,
      })
      .valueChanges.pipe(map(({data}: any) => data?.getFirstFileByDocumentID));
  }

  getFileByDocumentIDAndPageID(documentId: string, pageId: string): Observable<Response> {
    return this.getFileByDocumentIDAndPageIDQuery
      .watch({
        documentId: documentId,
        pageId: pageId,
      })
      .valueChanges.pipe(map(({data}: any) => data.getFileByDocumentIDAndPageID));
  }

  createDocument(document: Document): Observable<Response> {
    return this.createDocumentQuery
      .mutate({
        newDocument: {data: document},
      })
      .pipe(map(({data}: any) => data.createDocument));
  }

  getValuesByDocumentID(DocumentID: string): Observable<Response> {
    return this.getValuesByDocumentIdQuery
      .watch({
        DocumentID: DocumentID,
      })
      .valueChanges.pipe(map(({data}: any) => data.getValuesByDocumentID));
  }

  updateEntityToDocument(entityValue: EntityValue[], documentId: string): Observable<Response> {
    return this.updateEntityToDocumentQuery
      .mutate({
        requestUpdateEntitiesValues: {
          data: {
            entities: entityValue,
            document_id: documentId,
          },
        },
      })
      .pipe(map(({data}: any) => data.updateEntityToDocument));
  }

  NewEntityToDocument(entityValue: EntityValue[], documentId: string): Observable<Response> {
    return this.newEntityToDocumentQuery
      .mutate({
        requestNewEntitiesValues: {
          data: {
            entities: entityValue,
            document_id: documentId,
          },
        },
      })
      .pipe(map(({data}: any) => data.NewEntityToDocument));
  }

  deleteEntityToDocument(entities: any[], documentId: string): Observable<Response> {
    return this.deleteEntityToDocumentQuery
      .mutate({
        request: {
          data: {
            entities: entities,
            document_id: documentId,
          },
        },
      })
      .pipe(map(({data}: any) => data.deleteEntityToDocument));
  }

  getDocumentById(id: string): Observable<Response> {
    return this.getDocumentByIdQuery
      .watch({
        id: id,
      })
      .valueChanges.pipe(map(({data}: any) => data.getDocumentByID));
  }
}
