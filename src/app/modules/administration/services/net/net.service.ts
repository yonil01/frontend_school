import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo, QueryRef } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { CreateNet, UpdateNet, DeleteNet, Getnet } from './net.querys.service';
import { Response, Net } from '@app/core/models';
import { Observable } from 'rxjs';

/* const getAll = gql`
  query getNets {
    getNet {
      error
      data {
        id
        server
        ip
        port
        path
      }
      code
      type
      msg
    }
  }
`; */

@Injectable({
  providedIn: 'root',
})
export class NetService {

  constructor(
    private apollo: Apollo,
    private createNetQuery: CreateNet,
    private updateNetQuery: UpdateNet,
    private deletenetQuery: DeleteNet,
    private getnet: Getnet,
  ) {}

  // getIpService() {
  //   return (this.query = this.apollo.watchQuery({
  //     query: getAll,
  //   }));
  // }

  createNet(list: Net): Observable<Response> {
    return this.createNetQuery
      .mutate({
        req: { data: list },
      })
      .pipe(map(({ data }: any) => data.createNet));
  }

  updateNet(list: Net): Observable<Response> {
    return this.updateNetQuery
      .mutate({
        request: { data: list },
      })
      .pipe(map(({ data }: any) => data.updateNet));
  }

  deleteNet(idx: string): Observable<Response> {
    return this.deletenetQuery
      .mutate({
        id: idx,
      })
      .pipe(map(({ data }: any) => data.deleteNet));
  }

  getNet(): Observable<Response> {
    return this.getnet.watch({}).valueChanges.pipe(map(({ data }: any) => data.getNet));
  }
}
