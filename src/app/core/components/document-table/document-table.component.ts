import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Document} from '@app/core/models';
import {Store} from '@ngrx/store';
import {AppState} from '@app/core/store/app.reducers';
import {controlDocument} from '@app/core/store/actions/doctype-group.action';

@Component({
  selector: 'app-document-table',
  templateUrl: './document-table.component.html',
  styleUrls: ['./document-table.component.scss'],
})
export class DocumentTableComponent implements OnInit {
  @Input() cols = [];
  @Input() documents = [];
  @Input() title = '';
  @Output() selectedDocumentEvent = new EventEmitter<Document>();
  showEntities: boolean = false;

  contextSelectedDocument: any;
  _selectedColumns: any;
  selectedDocuments: Document[] = [];
  selectedDocument: Document = {};
  showFilter = true;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.documents = JSON.parse(JSON.stringify(this.documents));
    this._selectedColumns = [
      {field: 'id', header: 'Id'},
      {field: 'auto_name', header: 'Autoname'},
      {field: 'created_at', header: 'Fecha'},
    ];
    this.store.select('doctypeGroup').subscribe((state) => {
      this.selectedDocuments = JSON.parse(JSON.stringify(state.selectedDocuments));
      if (state.selectedDocuments.length) {
        this.selectedDocument = this.selectedDocuments[0];
      } else {
        this.selectedDocument = {};
      }
    });
  }

  selectDocument() {
    this.selectedDocuments = [];
    if (this.selectedDocument) {
      this.selectedDocuments.push(this.selectedDocument);
      this.selectedDocumentEvent.emit(this.selectedDocument);
    }
    this.store.dispatch(controlDocument({selectedDocuments: this.selectedDocuments}));
  }

  selectAllDocuments(): void {
    this.store.dispatch(controlDocument({selectedDocuments: this.selectedDocuments}));
  }
}
