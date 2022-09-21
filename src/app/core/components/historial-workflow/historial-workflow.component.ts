import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {TokenService} from '@app/core/services/graphql/token/token.service';
import {AppState} from '@app/core/store/app.reducers';

@Component({
  selector: 'app-historial-workflow',
  templateUrl: './historial-workflow.component.html',
  styleUrls: ['./historial-workflow.component.scss'],
})
export class HistorialWorkflowComponent implements OnInit, OnChanges {
  @Input() document: any = {};
  historial: any;
  colsTable: any;
  rowInfo: any;

  showFilter = false;

  constructor(private store: Store<AppState>, private tokenService: TokenService) {
  }

  ngOnInit(): void {
    this.colsTable = [
      {field: 'user', header: 'Usuario'},
      {field: 'process_name', header: 'Proceso'},
      {field: 'queue', header: 'Cola'},
      {field: 'execution', header: 'Ejecucion'},
      {field: 'activity', header: 'Actividad'},
      {field: 'rule', header: 'Regla'},
      {field: 'begin_at', header: 'Fecha'},
    ];
  }

  ngOnChanges(): void {
    this.getInitData();
  }

  getInitData(): void {
    this.historial = [];
    if (this.document) {
      this.tokenService.getTxTokenByDocumentID(this.document.id?.toString() || '').subscribe((resProcess) => {
        this.tokenService.getTxRuleByDocumentID(this.document.id?.toString() || '').subscribe((resRule) => {
          if (resProcess.data && resRule.data) {
            let mergeList: any = [];
            mergeList = mergeList.concat(resProcess.data);
            mergeList = mergeList.concat(resRule.data);
            mergeList.sort((date1: any, date2: any) => {
              if (date1.begin_at > date2.begin_at) {
                return 1;
              }
              if (date1.begin_at < date2.begin_at) {
                return -1;
              }
              return 0;
            });
            let index = 1;
            this.historial = mergeList.map((h: any) => ({
              user: h.user?.username ? h.user.username : '',
              process_name: h.process?.name ? h.process.name : '',
              queue: h.queue?.name ? h.queue.name : '',
              execution: h.execution?.name ? h.execution.name : '',
              activity: h.activity?.name ? h.activity.name : '',
              rule: h.rule?.name ? h.rule.name : '',
              token: h.token?.id ? h.token.id : '',
              project: h.project?.name ? h.project?.name : '',
              execution_type: h.execution_type ? h.execution_type : '',
              event: h.event ? h.event : h.event,
              doc_type: h.doc_type?.name ? h.doc_type.name : '',
              description: h.description ? h.description : '',
              activity_type: h.activity_type ? h.activity_type : '',
              route: h.route ? h.route : '',
              response: h.response ? h.response : '',
              begin_at: h.begin_at ? h.begin_at : '',
              index: index++,
            }));
          }
        });
      });
    }
  }

  openInfo(rowData: any): void {
    this.rowInfo = rowData;
  }
}
