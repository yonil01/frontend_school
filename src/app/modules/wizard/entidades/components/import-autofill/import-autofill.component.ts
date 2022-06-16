import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ToastService} from "ecapture-ng-ui";
import * as xlsx from 'xlsx';

@Component({
  selector: 'app-import-autofill',
  templateUrl: './import-autofill.component.html',
  styleUrls: ['./import-autofill.component.scss'],
  providers: [ToastService]
})
export class ImportAutofillComponent implements OnInit {

  @Output() closeModal = new EventEmitter<boolean>();

  public fileName:string = ''
  public fileType:string = ''
  public base64:string = ''
  public dataExcel:any[] = []
  public isShowImport:boolean = false

  constructor(private _messageService: ToastService) { }

  ngOnInit(): void {
  }

  private getBase64(file: File) {
    this.fileName = file.name;
    this.fileType = file.type;
    const reader: any = new FileReader();
    reader.onloadend = this._handleReaderLoaded.bind(this);
    reader.onerror = function (error: Error) {
      console.error('Error ' + error.message);
    };
    reader.readAsDataURL(file);
  }

  private _handleReaderLoaded(e: any) {
    const reader = e.target;
    // this.documentAnnexe.name = this.fileName;
    // this.documentAnnexe.type = this.fileType;
    // this.typeFile = 'base64';
    // this.documentAnnexe.b64 = reader.result;
    this.base64 = reader.result;
  }

  public clickUploadFile($event: any): void {
    this.readFileExcel($event)
    if ($event.target?.files[0]) this.dragDropFile($event.target?.files[0]);
  }

  public dragDropFile(file: File): void {
    /*if (file.type.indexOf('image') === 0 || file.type.indexOf('video/mp4')===0 || (typeof FileReader !== 'undefined' && file.type === 'application/pdf')) {
      this.getBase64(file);
    }*/
    //if (typeof FileReader !== 'undefined' || validFormatSupported(file.type)) {
      this.getBase64(file);
    //}
  }

  private readFileExcel(event: any) {
    debugger
    const target: DataTransfer = <DataTransfer>(event.target);

    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      /* create workbook */
      debugger
      const binarystr: string = e.target.result;
      const wb: xlsx.WorkBook = xlsx.read(binarystr, {type: 'binary'});

      /* selected the first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: xlsx.WorkSheet = wb.Sheets[wsname];

      /* save data */
      const data = xlsx.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}
      // Data will be logged in array format containing objects
      if (data.length === 0) {
        this._messageService.add({
          type: 'warn',
          message: 'Archivo vacío!',
          life: 8000
        });
      } else {
        // @ts-ignore
        if (Object.keys(data[0]).length > 2 || !data[0].hasOwnProperty('DIVIPOL')) {
          this._messageService.add({
            type: 'error',
            message: 'Este archivo no contiene la estructura de datos necesaria!',
            life: 8000
          });
        } else {
          this.dataExcel = data;
          this.isShowImport = true;
        }
      }
    };
  }



}
