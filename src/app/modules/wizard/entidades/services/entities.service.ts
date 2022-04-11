import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

import {Attribute, AttributeDataset, CascadingDataset, Entity, Response} from "@app/core/models";
import {
  CreateEntityQuery,
  GetAttributesByProjectQuery,
  GetEntitiesByProjectQuery,
  UpdateEntityQuery,
  GetEntityByIDQuery,
  GetEntitiesByIDQuery,
  DeleteEntityQuery,
  CreateAttributeQuery,
  UpdateAttributeQuery,
  DeleteAttributeQuery,
  CreateAttributeDatasetQuery,
  DeleteAttributeDatasetByAttIDAndDatasetIDQuery,
  CreateCascadingDatasetsQuery,
  UpdateCascadingDatasetsQuery,
  DeleteCascadingDatasetsQuery,
  GetCascadingDatasetsQuery,
  GetAttributesQuery, GetEntitiesQueryE
} from "@app/modules/wizard/entidades/services/entity.queries.service";

@Injectable({
  providedIn: 'root',
})
export class EntityService {
  constructor(
    private getEntitiesByProjectQuery: GetEntitiesByProjectQuery,
    private getAttributesByProjectQuery: GetAttributesByProjectQuery,
    private createEntityQuery: CreateEntityQuery,
    private updateEntityQuery: UpdateEntityQuery,
    private getEntityByIDQuery: GetEntityByIDQuery,
    private getEntitiesByIDQuery: GetEntitiesByIDQuery,
    private deleteEntityQuery: DeleteEntityQuery,
    private createAttributeQuery: CreateAttributeQuery,
    private updateAttributeQuery: UpdateAttributeQuery,
    private deleteAttributeQuery: DeleteAttributeQuery,
    private createAttributeDatasetQuery: CreateAttributeDatasetQuery,
    private deleteAttributeDatasetByAttIDAndDatasetIDQuery: DeleteAttributeDatasetByAttIDAndDatasetIDQuery,
    private createCascadingDatasetsQuery: CreateCascadingDatasetsQuery,
    private updateCascadingDatasetsQuery: UpdateCascadingDatasetsQuery,
    private deleteCascadingDatasetsQuery: DeleteCascadingDatasetsQuery,
    private getCascadingDatasetsQuery: GetCascadingDatasetsQuery,
    private getEntitiesQuery: GetEntitiesQueryE,
    private getAttributesQuery: GetAttributesQuery,
  ) {
  }

  getEntitiesByProject(project: string): Observable<Response> {
    return this.getEntitiesByProjectQuery
      .watch({
        project,
      })
      .valueChanges.pipe(map(({data}: any) => data.getEntitiesByProject));
  }

  getEntitiesByID(id: string): Observable<Response> {
    return this.getEntitiesByIDQuery
      .watch({
        id,
      })
      .valueChanges.pipe(map(({data}: any) => data.getEntitiesByID));
  }

  getEntityByID(id: string): Observable<Response> {
    return this.getEntityByIDQuery
      .watch({
        id,
      })
      .valueChanges.pipe(map(({data}: any) => data.getEntityByID));
  }

  getAttributesByProject(project: string): Observable<Response> {
    return this.getAttributesByProjectQuery
      .watch({
        project,
      })
      .valueChanges.pipe(map(({data}: any) => data.getEntitiesByProject));
  }

  createEntity(entity: Entity): Observable<Response> {
    return this.createEntityQuery
      .mutate({
        requestEntity: {data: entity},
      })
      .pipe(map(({data}: any) => data.createEntities));
  }

  updateEntity(entity: Entity): Observable<Response> {
    return this.updateEntityQuery
      .mutate({
        requestEntity: {data: entity},
      })
      .pipe(map(({data}: any) => data.updateEntities));
  }

  deleteEntity(id: string): Observable<Response> {
    return this.deleteEntityQuery
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => data.deleteEntities));
  }

  createAttribute(attribute: Attribute): Observable<Response> {
    return this.createAttributeQuery
      .mutate({
        request: {data: attribute},
      })
      .pipe(map(({data}: any) => data.createAttribute));
  }

  updateAttribute(attribute: Attribute): Observable<Response> {
    return this.updateAttributeQuery
      .mutate({
        request: {data: attribute},
      })
      .pipe(map(({data}: any) => data.updateAttribute));
  }

  deleteAttribute(id: string): Observable<Response> {
    return this.deleteAttributeQuery
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => data.deleteAttribute));
  }

  createAttributeDataset(attributeDataset: AttributeDataset): Observable<Response> {
    return this.createAttributeDatasetQuery
      .mutate({
        request: {data: attributeDataset},
      })
      .pipe(map(({data}: any) => data.createAttributeDataset));
  }

  DeleteAttributeDatasetByAttIDAndDatasetID(attribute_id: string, dataset_id: string): Observable<Response> {
    return this.deleteAttributeDatasetByAttIDAndDatasetIDQuery
      .mutate({
        attribute_id: attribute_id,
        dataset_id: dataset_id,
      })
      .pipe(map(({data}: any) => data.deleteAttributeDatasetByAttIDAndDatasetID));
  }

  createCascadingDatasets(cascadingDataset: CascadingDataset): Observable<Response> {
    return this.createCascadingDatasetsQuery
      .mutate({
        rq: {data: cascadingDataset},
      })
      .pipe(map(({data}: any) => data.createCascadingDatasets));
  }

  updateCascadingDatasets(cascadingDataset: CascadingDataset): Observable<Response> {
    return this.updateCascadingDatasetsQuery
      .mutate({
        rq: {data: cascadingDataset},
      })
      .pipe(map(({data}: any) => data.updateCascadingDatasets));
  }

  deleteCascadingDatasets(id: string): Observable<Response> {
    return this.deleteCascadingDatasetsQuery
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => data.deleteCascadingDatasets));
  }

  getCascadingDatasets(): Observable<Response> {
    return this.getCascadingDatasetsQuery
      .watch()
      .valueChanges.pipe(map(({data}: any) => data.getCascadingDatasets));
  }

  getAllEntities(): Observable<Response> {
    return this.getEntitiesQuery
      .watch()
      .valueChanges.pipe(map(({data}: any) => data.getEntities));
  }

  getAllAttributes(): Observable<Response> {
    return this.getAttributesQuery
      .watch()
      .valueChanges.pipe(map(({data}: any) => data.getAttributes));
  }

  getAllEntitiesPrueba(): Observable<Response> {
    return this.getEntitiesQuery
      .watch()
      .valueChanges.pipe(map(({data}: any) => data.getEntities));
  }

}
