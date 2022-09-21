import {Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges} from '@angular/core';
import {AppState} from '@app/core/store/app.reducers';
import {Store} from '@ngrx/store';
import {DocType} from '@app/core/models/getDoctypeGroups.model';
import {Subscription} from "rxjs/internal/Subscription";
import {saveAs} from "file-saver";
import {ExcelType} from "@app/core/utils/static/data";

import autoTable from "jspdf-autotable";
import {replaceAll} from "@app/core/utils/helpers/helpers";
import {FilterService} from "ecapture-ng-ui";
import {UsersService} from "@app/modules/administration/services/user/users.service";
import {columnGrado, dataGrado} from "@app/modules/administration/modules/grado/models/constans";
import {TableModel} from "@app/ui/components/table/model/table.model";
import {styleTableUser} from "@app/modules/administration/modules/users/models/model-user/constans-user";

@Component({
  selector: 'app-grado-table',
  templateUrl: './grado-table.component.html',
  styleUrls: ['./grado-table.component.scss'],
})
export class GradoTableComponent implements OnInit, OnDestroy, OnChanges {
  @Input() showDiagram: boolean = false;
  public styleTable: TableModel = styleTableUser;
  private _subscription: Subscription = new Subscription();
  public showArea: boolean = false;
  public cols: any[] = [];
  public columns: any[] = columnGrado;
  public documents: any = [];
  public documentsRestricted: any[] = [];
  public exportColumns: any[] = [];
  public _selectedColumns: any[] = [];
  public doctype: DocType = {};
  public displayModal = false;
  public operationSort: string = 'noSort';

  public documentsCurrent: number = 0;
  public paginationValue: number = 10;
  public documentsVisibility: any[] = dataGrado;
  public leftLimit: number = 0;
  public rightLimit: number = 10;
  public currentPositionPagination: number = 1;
  public colSelected: {field: string; header: string} = {
    field: '',
    header: ''
  };

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.columns.filter((col: any) => val.includes(col));
  }


  constructor(
    private store: Store<AppState>,
    private _filterService: FilterService,
  ) {
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  ngOnInit(): void {

    /* this.store.select('doctypeGroup').subscribe(
       (resState: any) => {
         let index = 1;
         if (resState.documents.length > 0) {
           this.doctype = resState.selectedDoctype;
           this.documents = resState.documents;
           this.documents = this.documents.map((doc: any) => {
             doc = Object.assign([], doc);
             doc = Object.assign({index: index}, doc);
             index++;
             return doc;
           });
           if (this.documents.length > 1000) {
             this.documentsRestricted = this.documents.slice(0, 1000);
             this.showModalDialog();
           } else {
             this.documentsRestricted = this.documents;
           }

           this.cols = Object.keys(this.documents[0]).map((item) => ({field: item, header: item}));
           // this.columns = this.cols;
           this.exportColumns = this.cols.map((col: any) => ({
             title: replaceAll(col.header.slice(2), '_', ' '),
             dataKey: replaceAll(col.field.slice(3), '_', ' ')
           }));

           this.documentsCurrent = Math.ceil(this.documentsRestricted.length / this.paginationValue);
           this.documentsVisibility = this.documentsRestricted.slice(this.leftLimit, this.rightLimit);

         } else {
           this.documents = [];
           this.documentsRestricted = [];
           this.cols = [];
           index = 1;
         }
         this._selectedColumns = this.columns;
       }
     );*/
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  public exportPdf(): void {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default('landscape', 'mm', 'a4');
        const colsExport = this.exportColumns.filter((item) => item.dataKey !== 'ex');
        const documents = JSON.parse(JSON.stringify(this.documents));
        const documentsOrder = documents.map((document: any) => {
          delete document.index;
          return Object.keys(document).map((key: string) => document[key]);
        });
        // @ts-ignore
        doc.autoTable({
          head: [colsExport],
          body: documentsOrder,
          theme: 'grid',
        })
        doc.save(this.doctype.name + '.pdf');
      })
    })
  }

  public exportExcel(): void {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.getDocuments());
      const workbook = {Sheets: {data: worksheet}, SheetNames: ['data']};
      const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
      this.saveAsExcelFile(excelBuffer, this.doctype.name || '');
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {type: ExcelType});
    saveAs(data, fileName + '_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  public exportCSV(): void {
    const replacer = (key: any, value: any) => (value === null ? '' : value);
    const header = Object.keys(this.documents[0]);
    const csv = this.documents.map((row: any) => header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    const csvArray = csv.join('\r\n');
    const blob = new Blob([csvArray], {type: 'text/csv'});
    saveAs(blob, this.doctype.name + '.csv');
  }

  public getDocuments(): any[] {
    const docs = [];
    for (const doc of this.documents) {
      docs.push(doc);
    }
    return docs;
  }

  public showModalDialog(): void {
    this.displayModal = true;
  }


  public nextPage(): void {
    this.currentPositionPagination++;
    this.leftLimit += this.paginationValue;
    this.rightLimit += this.paginationValue;
    this.documentsVisibility = this.documentsRestricted.slice(this.leftLimit, this.rightLimit);
  }

  public beforePage(): void {
    this.currentPositionPagination--;
    this.leftLimit -= this.paginationValue;
    this.rightLimit -= this.paginationValue;
    this.documentsVisibility = this.documentsRestricted.slice(this.leftLimit, this.rightLimit);
  }

  public changePaginationValue(): void {
    this.leftLimit = 0;
    this.rightLimit = this.paginationValue;
    this.documentsCurrent = Math.ceil(this.documentsRestricted.length / this.paginationValue);
    this.documentsVisibility = this.documentsRestricted.slice(this.leftLimit, this.rightLimit);
  }

  private initPagination(data: any[]): void {
    this.currentPositionPagination = 1;
    this.paginationValue = 10;
    this.leftLimit = 0;
    this.rightLimit = this.paginationValue;
    this.documentsCurrent = Math.ceil(data.length / this.paginationValue);
    this.documentsVisibility = data.slice(this.leftLimit, this.rightLimit);
  }

  public filterTable(value: any): void {
    const valueFilter = value.target.value;
    if (valueFilter) {
      const optionsFind = this.columns.map((item) => item.header);
      const filterData = this._filterService.filter(this.documentsRestricted, optionsFind, valueFilter, 'contains');
      this.initPagination(filterData);
    } else {
      this.initPagination(this.documentsRestricted);
    }
  }

  public sortByColum(column: any): void {
    if (this.colSelected.field !== column.field) {
      this.operationSort = 'noSort';
    }

    this.colSelected = column;
    if (this.operationSort === 'noSort') {
      this.operationSort = 'asc';
    } else if (this.operationSort === 'asc') {
      this.operationSort = 'desc';
    } else if (this.operationSort === 'desc') {
      this.operationSort = 'noSort';
    }
    const data = JSON.parse(JSON.stringify(this.documentsRestricted));
    let dataSorted;
    if (this.operationSort === 'asc') {
      dataSorted = data.sort((a: any, b: any) => {
        if (a[column.field] < b[column.field]) {
          return -1;
        } else if (a[column.field] > b[column.field]) {
          return 1;
        } else {
          return 0;
        }
      });
    } else if (this.operationSort === 'desc') {
      dataSorted = data.sort((a: any, b: any) => {
        if (a[column.field] > b[column.field]) {
          return -1;
        } else if (a[column.field] < b[column.field]) {
          return 1;
        } else {
          return 0;
        }
      });
    } else {
      this.colSelected = {
        field: '',
        header: ''
      };
      dataSorted = this.documents;
    }

    this.documentsRestricted = dataSorted;
    this.initPagination(dataSorted);
  }

  public showGraphic(): void {
    this.showArea = true;
  }
  public eventTableOption(resp:any): void {

  }

  public showEventButtonTable(event: any): void {
  }

}
