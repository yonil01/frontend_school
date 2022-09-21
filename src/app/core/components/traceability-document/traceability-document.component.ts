import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Document} from '@app/core/models';
import {AppState} from '@app/core/store/app.reducers';

@Component({
  selector: 'app-traceability-document',
  templateUrl: './traceability-document.component.html',
  styleUrls: ['./traceability-document.component.scss'],
})
export class TraceabilityDocumentComponent implements OnInit, OnChanges {
  // @ts-ignore
  @Input() document: Document;
  public traceability: any;
  public colsTable: any;
  public selectedDocuments: any;
  public rowInfo: any;
  public showFilter = false;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.colsTable = [
      {field: 'index', header: 'No.'},
      {field: 'user', header: 'Usuario'},
      {field: 'process_name', header: 'Proceso'},
      {field: 'queue', header: 'Cola'},
      {field: 'begin_at', header: 'Fecha'},
    ];
  }

  ngOnChanges(): void {
    this.getInitData();
  }

  getInitData(): void {
    this.traceability = [];
    if (this.document) {
      // @ts-ignore
      this.tokenService.getTxTokenByDocumentID(this.document.id.toString()).subscribe((res) => {
        const mapIdExecution: any = {};
        let index = 1;
        this.traceability = res.data
          ?.filter((tc: any) => {
            if (mapIdExecution[tc.id_execution]) {
              return false;
            } else {
              mapIdExecution[tc.id_execution] = tc.id_execution;
              return true;
            }
          })
          .map((tc: any) => {
            tc['index'] = index;
            index++;
            tc['user'] = tc.user.username;
            tc['process_name'] = tc.process.name;
            tc['queue'] = tc.queue.name;
            tc['project'] = tc.project.name;
            tc['execution'] = tc.execution.name;
            tc['doc_type'] = tc.doc_type.name;
            tc['token'] = tc.token?.id;
            return tc;
          });
      });

    }
  }

  public openInfo(rowData: any): void {
    this.rowInfo = rowData;
  }
}
