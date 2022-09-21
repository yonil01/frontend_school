import {Component, Input, OnInit} from '@angular/core';
import {DocTypeGroupsService} from '@app/core/services/graphql/doc-type-groups/doc-type-groups.service';
import {DocTypes, Document} from '@app/core/models';
import {DocumentService} from '@app/core/services/graphql/doc/document/document.service';
import {Store} from '@ngrx/store';
import {AppState} from '@app/core/store/app.reducers';
import {controlDocumentId} from '@app/core/store/actions/dynamic-forms.actions';

@Component({
  selector: 'app-import-form',
  templateUrl: './import-form.component.html',
  styleUrls: ['./import-form.component.scss'],
})
export class ImportFormComponent implements OnInit {
  @Input() documentForValues: Document = {};
  doctypeForms: DocTypes[] = [];
  isShowForm = false;
  isShowDynamicForm = false;
  urlPath = '';
  formDoctype: DocTypes = {};

  constructor(
    private docTypeGroupsService: DocTypeGroupsService,
    private documentService: DocumentService,
    private store: Store<AppState>,
  ) {
  }

  ngOnInit(): void {

    this.docTypeGroupsService.getDoctypeFormat().subscribe((res) => {
      res.data.map((dtg: any) => {
        this.doctypeForms = this.doctypeForms.concat(dtg);
      });
    });
  }

  async selectForm(form: DocTypes) {
    // this.store.dispatch(controlFormDoctype({ formDoctype: form }));
    if (form.url_path !== '') {
      this.isShowForm = true;
      this.urlPath = form.url_path + '?' + 'doctype=' + form.name;
    } else {
      this.formDoctype = form;
      this.isShowDynamicForm = true;
    }
  }

  private getDocument(idDocument: string): Promise<any> {
    return new Promise((resolv, rej) => {
      this.documentService.getDocumentByID(idDocument).subscribe((res: any) => {
        if (res.error) rej(true);
        resolv(res.data.file_encode);
      });
    });
  }

  private getEntitiesValuesByDocumentId(documentId: string): Promise<any> {
    return new Promise((resolv, rej) => {
      this.documentService.getValuesByDocumentID(documentId).subscribe((res) => {
        if (res.error) rej(true);
        resolv(res.data);
      });
    });
  }

  hideForm(): void {
    this.isShowForm = false;
    this.isShowDynamicForm = false;
    this.store.dispatch(controlDocumentId({documentId: ''}));
  }
}
