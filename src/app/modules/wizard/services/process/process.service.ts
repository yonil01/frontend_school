import {Injectable} from '@angular/core';
import {first, map} from 'rxjs/operators';
import {
  Process,
  Response,
  ProcessRole,
  ProcessDoctype,
  Queue,
  QueueRole,
  QueueAttribute,
  Execution,
  QueueComment,
} from '@app/core/models';
import {Observable} from 'rxjs';
import * as queries from '../process/process.queries.service';
import {Rule, Param} from '@app/core/models';
import {Ans, Reminder} from "@app/core/models/config/ans";
import {
  CreateAndReminder,
  CreateAns, DeleteAnsQuery, DeleteReminderQuery, GetAnsById,
  GetModuleAndReminder,
  GetModuleAns, GetTimersQuery, UpdateAndReminder, UpdateAns,
} from "../process/process.queries.service";

@Injectable({
  providedIn: 'root',
})
export class ProcessService {
  constructor(
    private getProcessQuery: queries.GetProcessQuery,
    private getProcessByIDQuery: queries.GetProcessByIDQuery,
    private getLockInfoQuery: queries.GetLockInfoQuery,
    private createProcessQuery: queries.CreateProcessQuery,
    private updateProcessQuery: queries.UpdateProcessQuery,
    private lockProcessQuery: queries.LockProcessQuery,
    private unlockProcessQuery: queries.UnlockProcessQuery,
    private deleteBpmQuery: queries.DeleteBpmQuery,
    private getProcessByProcessRootIDQuery: queries.GetProcessByProcessRootIDQuery,
    private publishBpmQuery: queries.PublishBpmQuery,
    private createProcessRoleQuery: queries.CreateProcessRoleQuery,
    private createProcessRolesQuery: queries.CreateProcessRolesQuery,
    private createProcessDoctypeQuery: queries.CreateProcessDoctypeQuery,
    private createProcessDoctypesQuery: queries.CreateProcessDoctypesQuery,
    private deleteProcessDoctypeQuery: queries.DeleteProcessDoctypeQuery,
    private deleteProcessRoleQuery: queries.DeleteProcessRoleQuery,
    private createQueueQuery: queries.CreateQueueQuery,
    private updateQueueQuery: queries.UpdateQueueQuery,
    private deleteQueueQuery: queries.DeleteQueueQuery,
    private createQueueCommentQuery: queries.CreateQueueCommentQuery,
    private deleteQueueCommentQuery: queries.DeleteQueueCommentQuery,
    private createQueueRoleQuery: queries.CreateQueueRoleQuery,
    private deleteQueueRoleQuery: queries.DeleteQueueRoleQuery,
    private createQueueAttributeQuery: queries.CreateQueueAttributeQuery,
    private deleteQueueAttributeQuery: queries.DeleteQueueAttributeQuery,
    private getProcessDistinctProcessRootQuery: queries.GetProcessDistinctProcessRootQuery,
    private getProcessByProjectIDQuery: queries.GetProcessByProjectIDQuery,
    private createExecutionQuery: queries.CreateExecutionQuery,
    private updateExecutionQuery: queries.UpdateExecutionQuery,
    private deleteExecutionQuery: queries.DeleteExecutionQuery,
    private createExecutionRoleQuery: queries.CreateExecutionRoleQuery,
    private deleteExecutionRoleQuery: queries.DeleteExecutionRoleQuery,
    private createExecutionRuleQuery: queries.CreateExecutionRuleQuery,
    private updateExecutionRuleQuery: queries.UpdateExecutionRuleQuery,
    private createRuleParamsQuery: queries.CreateRuleParamsQuery,
    private updateRuleParamsQuery: queries.UpdateRuleParamsQuery,
    private deleteExecutionRuleQuery: queries.DeleteExecutionRuleQuery,
    private deleteRuleParamsByRuleIDQuery: queries.DeleteRuleParamsByRuleIDQuery,
    private updateQueueCommentQuery: queries.UpdateQueueCommentQuery,

    private newAns: CreateAns,
    private getModuleAns: GetModuleAns,
    private getModuleReminder: GetModuleAndReminder,
    private newAndReminder: CreateAndReminder,
    private updateModuleAndReminder: UpdateAndReminder,
    private deleteModuleAns: DeleteAnsQuery,
    private getAnsModuleById: GetAnsById,
    private updateModuleAns: UpdateAns,
    private daleteModuleReminder: DeleteReminderQuery,
    private getTimersQuery: GetTimersQuery
  ) {
  }

  getProcess(): Observable<Response> {
    return this.getProcessQuery.watch().valueChanges.pipe(
      first(),
      map(({data}: any) => data.getProcess),
    );
  }

  getProcessDistinctProcessRoot(): Observable<Response> {
    return this.getProcessDistinctProcessRootQuery.watch().valueChanges.pipe(
      first(),
      map(({data}: any) => data.getProcessDistinctProcessRoot),
    );
  }

  public getProcessByProjectID(project_id: string): Observable<Response> {
    return this.getProcessByProjectIDQuery.watch({project_id}).valueChanges.pipe(first(), map(({data}: any) => data.getProcessByProjectID));
  }

  public getProcessByID(id: string): Observable<Response> {
    return this.getProcessByIDQuery.watch({id}).valueChanges.pipe(first(), map(({data}: any) => data.getProcessByID));
  }

  public getLockInfo(id: string): Observable<Response> {
    return this.getLockInfoQuery.watch({id}).valueChanges.pipe(first(), map(({data}: any) => data.getProcessByID));
  }

  public createProcess(bpm: Process): Observable<Response> {
    return this.createProcessQuery.mutate({request: {data: bpm}}).pipe(map(({data}: any) => data.createProcess));
  }

  public updateProcess(bpm: Process): Observable<Response> {
    return this.updateProcessQuery.mutate({request: {data: bpm}}).pipe(map(({data}: any) => data.updateProcess));
  }

  public getTimers(): Observable<Response> {
    return this.getTimersQuery.watch({}).valueChanges.pipe(map(({data}: any) => data.getTimer));
  }

  lockProcess(id: string): Observable<Response> {
    return this.lockProcessQuery
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => data.lockProcess));
  }

  unlockProcess(id: string): Observable<Response> {
    return this.unlockProcessQuery
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => data.unlockProcess));
  }

  deleteBpm(id: string): Observable<Response> {
    return this.deleteBpmQuery
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => data.deleteBpm));
  }

  getProcessByProcessRootID(id: string): Observable<Response> {
    return this.getProcessByProcessRootIDQuery
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => data.getProcessByProcessRootID));
  }

  publishBpm(id: string, processRoot: string): Observable<Response> {
    return this.publishBpmQuery
      .mutate({
        id: id,
        processRoot: processRoot,
      })
      .pipe(map(({data}: any) => data.publishProcess));
  }

  createProcessRole(processRole: ProcessRole): Observable<Response> {
    return this.createProcessRoleQuery
      .mutate({
        request: {data: processRole},
      })
      .pipe(map(({data}: any) => data.createProcessRole));
  }

  deleteProcessRole(id: string): Observable<Response> {
    return this.deleteProcessRoleQuery
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => data.deleteProcessRole));
  }

  createProcessRoles(processRole: ProcessRole[]): Observable<Response> {
    return this.createProcessRolesQuery
      .mutate({
        request: {data: processRole},
      })
      .pipe(map(({data}: any) => data.createProcessRoles));
  }

  createProcessDoctype(processDoctype: any): Observable<Response> {
    return this.createProcessDoctypeQuery
      .mutate({
        request: {data: processDoctype},
      })
      .pipe(map(({data}: any) => data.createProcessDoctype));
  }

  createProcessDoctypes(processDoctypes: ProcessDoctype[]): Observable<Response> {
    return this.createProcessDoctypesQuery
      .mutate({
        request: {data: processDoctypes},
      })
      .pipe(map(({data}: any) => data.createProcessDoctypes));
  }

  deleteProcessDoctype(id: string): Observable<Response> {
    return this.deleteProcessDoctypeQuery
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => data.deleteProcessDoctype));
  }

  createQueue(queue: Queue): Observable<Response> {
    return this.createQueueQuery
      .mutate({
        request: {data: queue},
      })
      .pipe(map(({data}: any) => data.createQueue));
  }

  updateQueue(queue: Queue): Observable<Response> {
    return this.updateQueueQuery
      .mutate({
        request: {data: queue},
      })
      .pipe(map(({data}: any) => data.updateQueue));
  }

  deleteQueue(id: string): Observable<Response> {
    return this.deleteQueueQuery
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => data.deleteQueue));
  }

  createQueueComment(comment: QueueComment): Observable<Response> {
    return this.createQueueCommentQuery
      .mutate({
        request: {data: comment},
      })
      .pipe(map(({data}: any) => data.createQueueComment));
  }

  updateQueueComment(comment: QueueComment): Observable<Response> {
    return this.updateQueueCommentQuery
      .mutate({
        request: {data: comment},
      })
      .pipe(map(({data}: any) => data.updateQueueComment));
  }

  deleteQueueComment(id: string): Observable<Response> {
    return this.deleteQueueCommentQuery
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => data.deleteQueueComment));
  }

  createQueueRole(queue: QueueRole): Observable<Response> {
    return this.createQueueRoleQuery
      .mutate({
        request: {data: queue},
      })
      .pipe(map(({data}: any) => data.createQueueRole));
  }

  deleteQueueRole(id: string): Observable<Response> {
    return this.deleteQueueRoleQuery
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => data.deleteQueueRole));
  }

  createQueueAttribute(attribute: QueueAttribute): Observable<Response> {
    return this.createQueueAttributeQuery
      .mutate({
        request: {data: attribute},
      })
      .pipe(map(({data}: any) => data.createQueueAttribute));
  }

  deleteQueueAttribute(id: string): Observable<Response> {
    return this.deleteQueueAttributeQuery
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => data.deleteQueueAttribute));
  }

  createExecution(execution: Execution): Observable<Response> {
    return this.createExecutionQuery
      .mutate({
        request: {data: execution},
      })
      .pipe(map(({data}: any) => data.createExecution));
  }

  updateExecution(execution: Execution): Observable<Response> {
    return this.updateExecutionQuery
      .mutate({
        request: {data: execution},
      })
      .pipe(map(({data}: any) => data.updateExecution));
  }

  deleteExecution(id: string): Observable<Response> {
    return this.deleteExecutionQuery
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => data.deleteExecution));
  }

  createExecutionRole(executionRole: any): Observable<Response> {
    return this.createExecutionRoleQuery
      .mutate({
        request: {data: executionRole},
      })
      .pipe(map(({data}: any) => data.createExecutionRole));
  }

  deleteExecutionRole(id: string): Observable<Response> {
    return this.deleteExecutionRoleQuery
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => data.deleteExecutionRole));
  }

  public createExecutionRule(rule: Rule): Observable<Response> {
    return this.createExecutionRuleQuery.mutate({request: {data: rule}}).pipe(map(({data}: any) => data.createExecutionRule));
  }

  updateExecutionRule(rule: Rule): Observable<Response> {
    return this.updateExecutionRuleQuery
      .mutate({
        request: {data: rule},
      })
      .pipe(map(({data}: any) => data.updateExecutionRule));
  }

  createRuleParams(param: Param): Observable<Response> {
    return this.createRuleParamsQuery
      .mutate({
        request: {data: param},
      })
      .pipe(map(({data}: any) => data.createRuleParams));
  }

  updateRuleParams(param: Param): Observable<Response> {
    return this.updateRuleParamsQuery
      .mutate({
        request: {data: param},
      })
      .pipe(map(({data}: any) => data.updateRuleParams));
  }

  deleteExecutionRule(id: string): Observable<Response> {
    return this.deleteExecutionRuleQuery
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => data.deleteExecutionRule));
  }

  deleteRuleParamsByRuleID(rule_id: string): Observable<Response> {
    return this.deleteRuleParamsByRuleIDQuery
      .mutate({
        rule_id: rule_id,
      })
      .pipe(map(({data}: any) => data.deleteRuleParamsByRuleID));
  }

  getDefaultBPMN(): Promise<any> {
    const url = 'assets/img/default.bpmn';
    return new Promise((res, rej) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'document';
      xhr.overrideMimeType('text/xml');
      xhr.onload = function () {
        if (xhr.readyState === xhr.DONE && xhr.status === 200) {
          res(xhr.responseXML);
        } else {
          rej('error');
        }
      };
      xhr.send();
    });
  }

  getDefaultSVG(): Promise<any> {
    const url = 'assets/img/raw-svg/default-bpmn.svg';
    return new Promise((res, rej) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'document';
      xhr.overrideMimeType('text/xml');
      xhr.onload = function () {
        if (xhr.readyState === xhr.DONE && xhr.status === 200) {
          res(xhr.responseXML);
        } else {
          rej('error');
        }
      };
      xhr.send();
    });
  }

  createAns(Ans: Ans): Observable<Response> {
    return this.newAns
      .mutate({
        rq: {data: Ans},
      })
      .pipe(map(({data}: any) => data.createAns));
  }

  updateAns(Ans: Ans): Observable<Response> {
    return this.updateModuleAns
      .mutate({
        rq: {data: Ans},
      })
      .pipe(map(({data}: any) => data.updateAns));
  }

  getAns(): Observable<Response> {
    return this.getModuleAns.watch().valueChanges.pipe(map(({data}: any) => data.getAns));
  }
  getReminders(): Observable<Response> {
    return this.getModuleReminder.watch().valueChanges.pipe(map(({data}: any) => data.getModules));
  }

  createAndReminder(reminder: Reminder): Observable<Response> {
    return this.newAndReminder
      .mutate({
        rq: {data: reminder},
      })
      .pipe(map(({data}: any) => data.createAnsReminder));
  }

  updateAndReminder(reminder: Reminder): Observable<Response> {
    return this.updateModuleAndReminder
      .mutate({
        rq: {data: reminder},
      })
      .pipe(map(({data}: any) => data.updateAnsReminder));
  }

  deleteAns(id: string): Observable<Response> {
    return this.deleteModuleAns
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => data.deleteAns));
  }

  public getAndsByID(id: string): Observable<Response> {
    return this.getAnsModuleById.watch({id}).valueChanges.pipe(first(), map(({data}: any) => data.getAnsByID));
  }

  deleteReminder(id: string): Observable<Response> {
    return this.daleteModuleReminder
      .mutate({
        id: id,
      })
      .pipe(map(({data}: any) => {
        return data.deleteAnsReminder
      }));
  }
}
