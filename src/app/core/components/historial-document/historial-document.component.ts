import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {TokenService} from '@app/core/services/graphql/token/token.service';
import {AppState} from '@app/core/store/app.reducers';

@Component({
  selector: 'app-historial-document',
  templateUrl: './historial-document.component.html',
  styleUrls: ['./historial-document.component.scss'],
})
export class HistorialDocumentComponent implements OnInit, OnChanges {
  @Input() document: any = {};
  colsTable: any;
  historial: any;
  selectedDocuments: any;
  rowInfo: any;
  showFilter = false;

  constructor(private store: Store<AppState>, private tokenService: TokenService) {
  }

  ngOnInit(): void {
    this.colsTable = [
      {field: 'document', header: 'Documento'},
      {field: 'project', header: 'Proyecto'},
      {field: 'event', header: 'Evento'},
      {field: 'user', header: 'Usuario'},
      // { field: 'attribute', header: 'Atributo' },
      // { field: 'value', header: 'Valor' },
      // { field: 'description', header: 'Descripcion' },
      // { field: 'doc_type', header: 'Tipo Documental' },
      // { field: 'entity', header: 'Entidad' },
      {field: 'created_at', header: 'Fecha'},
    ];
    this.store.select('menuDocuments').subscribe((state) => {
      const historial = JSON.parse(JSON.stringify(state.historialDocument));
      let index = 1;
      this.historial = historial?.map((tc: any) => {
        tc['index'] = index;
        tc['document'] = tc.document.auto_name;
        tc['project'] = tc.project ? tc.project.name : '';
        tc['user'] = tc.user.username;
        tc['doc_type'] = tc.doc_type.name;
        tc['attribute'] = tc.attribute ? tc.attribute.name : '';
        tc['entity'] = tc.entity ? tc.entity.name : '';
        index++;
        return tc;
      });
    });
    this.store.select('doctypeGroup').subscribe((state) => {
      this.selectedDocuments = state.selectedDocuments;
    });
  }

  ngOnChanges(): void {
    this.getInitData();
  }

  getInitData(): void {
    this.historial = [];
    this.tokenService.getTxDocByDocumentID(this.document.id?.toString() || '').subscribe((res) => {
      let index = 1;
      this.historial = res.data?.map((tc: any) => {
        tc['index'] = index;
        tc['document'] = tc.document.auto_name;
        tc['project'] = tc.project ? tc.project.name : '';
        tc['user'] = tc.user.username;
        tc['doc_type'] = tc.doc_type.name;
        tc['attribute'] = tc.attribute ? tc.attribute.name : '';
        tc['entity'] = tc.entity ? tc.entity.name : '';
        index++;
        return tc;
      });
    });
  }

  openInfo(rowData: any): void {
    this.rowInfo = rowData;
  }
}
