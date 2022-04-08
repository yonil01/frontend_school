import { Injectable, ɵNG_INJ_DEF } from '@angular/core';
import { Response, Messages } from '@app/core/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  GetAllMsgs,
  CreateMsg,
  DeleteMsg,
  UpdateMsg,
} from '@app/modules/administration/services/message/message.query.service';

@Injectable({
  providedIn: 'root',
})
export class MessageServices {
  constructor(
    private getAllMsgsQuery: GetAllMsgs,
    private createMsgQuery: CreateMsg,
    private deleteMsgQuery: DeleteMsg,
    private updateMsgQuery: UpdateMsg,
  ) {}

  public getAllMsgsService(): Observable<Response> {
    return this.getAllMsgsQuery.watch({}).valueChanges.pipe(map(({ data }: any) => data.getMessage));
  }

  public createMsgService(list: Messages): Observable<Response> {
    return this.createMsgQuery.mutate({req: { data: list }}).pipe(map(({ data }: any) => data.createMessage));
  }

  public deleateMsgService(indice: string): Observable<Response> {
    return this.deleteMsgQuery.mutate({id: indice}).pipe(map(({ data }: any) => data.deleteMessage));
  }

  public updateMsgService(list: Messages): Observable<Response> {
    return this.updateMsgQuery.mutate({request: { data: list }}).pipe(map(({ data }: any) => data.updateMessage));
  }
}
