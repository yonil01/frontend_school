import {Injectable} from '@angular/core';
import {
  GetAttributeCascadingDatasetsQuery,
  CreateAttributeCascadingDatasetQuery,
  UpdateAttributeCascadingDatasetQuery,
  DeleteAttributeCascadingDatasetQuery,
  GetCascadingDatasetValueByIdAttributeQuery,
} from './cascadingdatasets.queries.service';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {AttributeCascadingDatasets} from '@app/core/models/config/cascadingdatasets';

import {Response} from '@app/core/models';

@Injectable({
  providedIn: 'root',
})
export class CascadingdatasetsService {
  constructor(
    private getAttributeCascadingDatasetsQuery: GetAttributeCascadingDatasetsQuery,
    private createAttributeCascadingDatasetQuery: CreateAttributeCascadingDatasetQuery,
    private updateAttributeCascadingDatasetQuery: UpdateAttributeCascadingDatasetQuery,
    private deleteAttributeCascadingDatasetQuery: DeleteAttributeCascadingDatasetQuery,
    private getCascadingDatasetValueByIdAttributeQuery: GetCascadingDatasetValueByIdAttributeQuery,
  ) {
  }

  getAttributeCascadingDataset(): Observable<Response> {
    return this.getAttributeCascadingDatasetsQuery
      .watch()
      .valueChanges.pipe(map(({data}: any) => data.getAttributeCascadingDatasets));
  }

  createCascadingDatasets(cascading: AttributeCascadingDatasets): Observable<Response> {
    return this.createAttributeCascadingDatasetQuery
      .mutate({
        rq: {data: cascading},
      })
      .pipe(map(({data}: any) => data.createAttributeCascadingDataset));
  }

  updateAttributeCascadingDataset(cascading: AttributeCascadingDatasets): Observable<Response> {
    return this.updateAttributeCascadingDatasetQuery
      .mutate({
        rq: {data: cascading},
      })
      .pipe(map(({data}: any) => data.updateAttributeCascadingDataset));
  }

  deleteAttributeCascadingDataset(datDelete: AttributeCascadingDatasets): Observable<Response> {
    return this.deleteAttributeCascadingDatasetQuery
      .mutate({rq: {data: datDelete}})
      .pipe(map(({data}: any) => data.deleteAttributeCascadingDataset));
  }

  getCascadingDatasetValueByIdAttribute(
    cascading_dataset_id: string,
    attribute_id: string,
    attribute_id_value: string,
    value: string,
  ): Observable<Response> {
    return this.getCascadingDatasetValueByIdAttributeQuery
      .watch({
        cascading_dataset_id: cascading_dataset_id,
        attribute_id: attribute_id,
        attribute_id_value: attribute_id_value,
        value: value,
      })
      .valueChanges.pipe(map(({data}: any) => data.getCascadingDatasetValueByIdAttribute));
  }
}
