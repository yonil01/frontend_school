import {Component, OnInit, ElementRef, OnDestroy, Input} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Response, Document, Entity} from '@app/core/models';
import {DocumentService} from '@app/core/services/graphql/doc/document/document.service';
import {DocTypeGroupsService} from '@app/core/services/graphql/doc-type-groups/doc-type-groups.service';
import * as jsPDF from 'jspdf';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-import-document',
  templateUrl: './import-document.component.html',
  styleUrls: ['./import-document.component.scss'],
  providers: [],
})
export class ImportDocumentComponent implements OnInit, OnDestroy {
  @Input() document: Document = {};
  form = new FormGroup({});
  files: File[] = [];
  docToView: any;
  docToSend: string = '';
  extension: string = '';
  urlType = 'base64';
  doctypes: any = [];
  docgroups: any;
  selectedDoctypegroup = new FormControl('');
  selectedDoctype = new FormControl('');
  showTiff = false;
  showImg = false;
  pdfshow = false;
  errorFile = false;
  showKeywords = false;
  pdfSrc = '';
  imageTemp: any;
  showVisor = false;

  entities: Entity[] = [];
  entitiesValues: any[] = [];
  validatorEntities = {simples: false, multiples: false};

  models: any = {};
  fields: { [key: string]: any[] } = {};

  observableGetEntities = new FormControl('');

  constructor(
    private doctypeService: DocTypeGroupsService,
    private elementRef: ElementRef,
    private documentService: DocumentService,
  ) {
  }

  ngOnInit(): void {
    this.getDoctypesGroup();
    this.selectedDoctypegroup.valueChanges.subscribe((val) => {
      this.doctypes = this.selectedDoctypegroup.value?.doctypes
        ? this.selectedDoctypegroup.value.doctypes.map((doc: any) => ({label: doc.name, value: doc}))
        : [];
    });

    this.selectedDoctype.valueChanges.subscribe((val) => {
      this.entities = this.selectedDoctype.value?.doctypes_entities
        ? this.selectedDoctype.value.doctypes_entities.map((de: any) => de.entities)
        : [];
      this.showKeywords = true;
    });
  }

  private getDoctypesGroup(): void {
    this.doctypeService.getDocTypeGroups().subscribe((res: Response) => {
      this.docgroups = res.data.map((e: any) => {
        return {label: e.name, value: e};
      });
    });
  }

  uploadFile(file: File): void {
    /*this._messageService.clear();*/
    this.files = [];
    if (file.type.indexOf('image') === 0 || (typeof FileReader !== 'undefined' && file.type === 'application/pdf')) {
      this.files.push(file);
      this.getBase64(file);
    } else {
      this.docToView = null;
      this.files = [];
      this.pushMessage('error', 'El formato del archivo no es valido!', 'myKey1', 5000);
    }
  }

  private getBase64(file: File) {
    const reader: any = new FileReader();
    reader.onloadend = this._handleReaderLoaded.bind(this);
    reader.onerror = function (error: Error) {
      console.log('Error ' + error.message);
    };
    reader.readAsDataURL(file);
  }

  private _handleReaderLoaded(e: any) {
    this.extension = this.files[0].type.split('/').pop() || '';
    const reader = e.target;
    this.docToSend = e.target.result;
    if (this.extension === 'pdf') {
      this.docToView = reader.result.split(',').pop();
      this.showVisor = true;
    } else {
      if (
        this.extension !== 'svg' &&
        this.extension !== 'tif' &&
        this.extension !== 'gif' &&
        this.extension !== 'png'
      ) {
        this.imgToPdf(reader.result.split(',').pop());
        this.extension = 'pdf';
      } else {
        this.docToView = reader.result;
        this.showVisor = true;
      }
    }
  }

  private imgToPdf(imgbase64: string) {
    // @ts-ignore
    const doc = new jsPDF();
    doc.addImage(imgbase64, 0, 0);
    this.docToView = btoa(doc.output('datauri').split(',').pop());
    this.showVisor = true;
  }

  deleteAttachment(index: number) {
    this.files.splice(index, 1);
    this.resetSearch();
  }

  private resetSearch(): void {
    this.selectedDoctype.reset();
    this.selectedDoctypegroup.reset();
    this.files = [];
    this.imageTemp = '';
    this.showKeywords = false;
    this.pdfSrc = '';
    this.pdfshow = false;
    this.showImg = false;
    this.showTiff = false;
    this.showVisor = false;
  }

  updateFile(file: File) {
    this.uploadFile(file);
  }

  executeObservableEntities(): void {
    this.observableGetEntities.setValue(uuidv4());
  }

  loadEntitiesSimples(event: any): void {
    this.entitiesValues = this.entitiesValues.concat(event);
    this.validatorEntities.simples = true;
    this.validateLoadEntities();
  }

  loadEntitiesMultiples(event: any): void {
    this.entitiesValues = this.entitiesValues.concat(event);
    this.validatorEntities.multiples = true;
    this.validateLoadEntities();
  }

  validateLoadEntities(): void {
    if (this.validatorEntities.simples && this.validatorEntities.multiples) {
      this.createDocument();
    }
  }

  createDocument() {
    // @ts-ignore
    const document: Document = {
      doctype_id: this.selectedDoctype.value.id.toLowerCase(),
      doctype: this.selectedDoctype.value.name,
      original_file: this.files[0].name,
      new_version: 0,
      file_encode: this.docToSend.split(',').pop(),
      entities: this.entitiesValues,
    };
    this.documentService.createDocument(document).subscribe((res) => {
      if (!res.error) {
        this.resetSearch();
        this.pushMessage('success', 'Importación de documentos', 'myKey1', 5000, 'Documento importado correctamente.');
      } else {
        this.pushMessage('error', 'Importación de documentos', 'myKey1', 5000, 'Ha ocurrido un error');
      }
    });
    this.validatorEntities.simples = false;
    this.validatorEntities.multiples = false;
  }

  private pushMessage(severity: string, summary: string, key: string, life?: number, detail?: string) {
    /*this._messageService.add({
      severity: severity,
      summary: summary,
      key: key,
      life: life,
      detail: detail,
    });*/
  }

  ngOnDestroy() {
  }
}
