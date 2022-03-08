import { Injectable } from '@angular/core';
import { QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WhiteList, Response } from '@app/core/models';
import {
  CreateWhitelistQuery,
  DeleteIpQuery,
  GetWhiteListQuery,
  UpdateWhiteListQuery,
} from '@app/modules/administration/services/whitelist/whitelist.queries.service';

@Injectable({
  providedIn: 'root',
})
export class WhitelistService {
  dataIp: any[] = [];

  constructor(
    private getWhiteListQuery: GetWhiteListQuery,
    private createWhitelistQuery: CreateWhitelistQuery,
    private updateWhiteListQuery: UpdateWhiteListQuery,
    private borrarIpQuery: DeleteIpQuery,
  ) {}

  getWhiteList(): Observable<Response> {
    return this.getWhiteListQuery.watch({}).valueChanges.pipe(map(({ data }: any) => data.getWhiteList));
  }

  createWhitelist(dirIp: WhiteList): Observable<Response> {
    return this.createWhitelistQuery
      .mutate({
        request: { data: dirIp },
      })
      .pipe(map(({ data }: any) => data.createWhiteList));
  }

  eliminarIPService(ip: string): Observable<Response> {
    return this.borrarIpQuery
      .mutate({
        id: ip,
      })
      .pipe(map(({ data }: any) => data.deleteWhiteList));
  }

  deleteIPService(ip: string): Observable<Response> {
    return this.borrarIpQuery
      .mutate({
        id: ip,
      })
      .pipe(map(({ data }: any) => data.deleteWhiteList));
  }

  updateWhiteList(dirIp: WhiteList): Observable<Response> {
    return this.updateWhiteListQuery
      .mutate({
        request: { data: dirIp },
      })
      .pipe(map(({ data }: any) => data.updateWhiteList));
  }
}
