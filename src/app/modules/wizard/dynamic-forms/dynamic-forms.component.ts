import { Component, OnInit } from '@angular/core';
import {TableModel} from "@app/ui/components/table/model/table.model";
import { styleTableFirst} from "@app/modules/wizard/dynamic-forms/models/constans"
import {Router} from "@angular/router";
import { DocTypeGroupsService } from '@app/core/services/graphql/doc-type-groups/doc-type-groups.service';
import {DocTypes, Project} from "@app/core/models";
import {controlEForm, controlFormDoctype, controlJsonForm} from "@app/core/store/actions/dynamic-forms.actions";
import {AppState} from "@app/core/store/app.reducers";
import {Store} from "@ngrx/store";
import {DocumentService} from "@app/core/services/graphql/doc/document/document.service";
import {Form} from "@app/core/models/config/form";

@Component({
  selector: 'app-dynamic-forms',
  templateUrl: './dynamic-forms.component.html',
  styleUrls: ['./dynamic-forms.component.scss']
})
export class DynamicFormsComponent implements OnInit {
  public styleTable: TableModel = styleTableFirst;
  project: Project;
  doctypeForms: DocTypes[] = [];
  formDoctype: DocTypes;
  doctypeId: string | undefined;
  disableDropdownContainer:boolean = false;

  constructor(private router: Router,
              private docTypeGroupsService: DocTypeGroupsService,
              private store: Store<AppState>,
              private documentService: DocumentService,
              ) {
    this.project = {};
    this.formDoctype = {};
    this.doctypeId = '';
  }

  ngOnInit(): void {

    // @ts-ignore
    this.project = JSON.parse(sessionStorage.getItem('project'));
    // @ts-ignore
    this.docTypeGroupsService.getDoctypesByFormatAnfProjectID('frm', this.project.id?.toLowerCase()).subscribe((res) => {
      res.data.map((dtg: any) => {
        this.doctypeForms = this.doctypeForms.concat(dtg);
        this.styleTable.dataSource?.push(dtg)
        // this.doctypeId = this.doctypeForms[0].id;
      });
    });
  }

  public eventTableOption(data:any): void {
    if (data.type === 'normally') {
      this.selectedForm(data.form);
      this.router.navigate(['/wizard/dymanic-forms/configuration'])
    }
  }

  public selectedForm(form: DocTypes) {
    if (form !== null) {
      this.store.dispatch(controlFormDoctype({ formDoctype: form }));
      this.formDoctype = form;
      this.doctypeId = this.formDoctype.id;
      if (form.procedure) {
        this.getDocument(form.procedure).then((fileEncode) => {
          const decodeJson = atob(fileEncode);
          const jsonModelerAndViewer = JSON.parse(decodeJson);
          this.store.dispatch(controlEForm({ eform: jsonModelerAndViewer.modeler }));
          this.store.dispatch(controlJsonForm({ jsonForm: jsonModelerAndViewer.viewer, models: {} }));

          if (jsonModelerAndViewer.modeler.containers.length > 0) {
            this.disableDropdownContainer = false;
          } else {
            this.disableDropdownContainer = true;
          }
        });
      } else {
        const eform: Form = {
          doctype: form.name,
          type: '',
          containers: [],
        };
        this.disableDropdownContainer = true;

        this.store.dispatch(controlEForm({ eform: eform }));
      }
    }
  }

  private getDocument(idDocument: string): Promise<any> {
    return new Promise((resolv, rej) => {
      this.documentService.getDocumentByID(parseInt(idDocument, 10)).subscribe((res: any) => {
        if (res.error) rej(true);
        resolv(res.data.file_encode);
      });
    });
  }

}
