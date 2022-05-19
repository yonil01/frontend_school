import {Component, OnDestroy, OnInit} from '@angular/core';
import {MessageServices} from "@app/modules/administration/services/message/message.service";
import {Subscription} from "rxjs/internal/Subscription";
import {ToastService} from "ecapture-ng-ui";
import {MsgModel} from "@app/modules/administration/modules/messages/models/msg.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {Parameters} from "@app/modules/administration/modules/parameters/models/parameters.models";
import {FilterService} from "@app/ui/services/filter.service";
import {ExcelType} from "@app/ui/utils/constants/constants";
import {saveAs} from "file-saver";

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.scss']
})
export class MessagesListComponent implements OnInit, OnDestroy {

  private _subscription: Subscription = new Subscription();
  public messages: MsgModel[] = [];
  public messagesPagination: MsgModel[] = [];
  public showAlert: boolean = false;
  public onShowEditMessages: boolean = false;
  public onShowMessagesList: boolean = true;
  public selectedMessage!: MsgModel;
  public messageForm: FormGroup;
  public exportColumns: any[] = [];
  public createOrEdit: boolean = false;
  public idMessages: number = 0;
  public isShowBlockPage: boolean = false;
  public toastStyle: ToastStyleModel = toastDataStyle;
  public leftLimit: number = 0;
  public rightLimit: number = 10;
  public currentPg: number = 1;
  public paginationValue: number = 10;
  public currentLengthPg: number = 0;

  constructor(
    private _messageService: MessageServices,
    private _toastService: ToastService,
    private _fb: FormBuilder,
    private filterService: FilterService
  ) {
    this.messageForm = _fb.group({
      eng: ["", [Validators.required, Validators.maxLength(50), Validators.minLength(4)]],
      spa: ["", [Validators.required, Validators.maxLength(50), Validators.minLength(4)]],
      type_message: ["", [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.getAllMsg();
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  private getAllMsg(): void {
    this.isShowBlockPage = true
    this._subscription.add(
      this._messageService.getAllMsgsService().subscribe(
        {
          next: (res) => {
            if (res.error) {
              this._toastService.add({type: 'error', message: res.msg, life: 5000});
            } else {
              if (res.data) {
                this.messages = res.data;
                this.initPagination();
              } else {
                this._toastService.add({type: 'info', message: 'No hay mensajes creados', life: 5000});
              }
            }
            this.isShowBlockPage = false
          },
          error: (err: Error) => {
            console.error(err.message);
            this._toastService.add({
              type: 'error',
              message: 'No se pudo obtener la información solicitada, Contactese con el administrador de servicio!',
              life: 5000
            });
          }
        }
      )
    );
  }

  public deleteMsg(id: number): void {
    this.showAlert = false;
    this.isShowBlockPage = true
    this._subscription.add(
      this._messageService.deleateMsgService(id).subscribe({
        next: (res) => {
          if (res.error) {
            this._toastService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            this._toastService.add({type: 'success', message: 'Mensage eliminado correctamente!', life: 500});
            this.messages = this.messages.filter(msg => msg.id !== id);
            this.initPagination();
          }
          this.isShowBlockPage = false;
        },
        error: (err: Error) => {
          this.isShowBlockPage = false;
          console.error(err.message);
          this._toastService.add({
            type: 'error',
            message: 'No se pudo obtener la información solicitada, Contactese con el administrador de servicio!',
            life: 5000
          });
        }
      })
    );
  }

  public editMessage(): void {
    if (this.messageForm.valid) {
      const msg = {
        id: this.idMessages,
        ...this.messageForm.value
      }
      this.isShowBlockPage = true;
      this._subscription.add(
        this._messageService.updateMsgService(msg).subscribe({
          next: (res) => {
            if (res.error) {
              this._toastService.add({type: "error", message: res.msg, life: 5000})
            } else {
              const index = this.messages.findIndex(msg => msg.id === this.idMessages);
              if (index !== -1) {
                this.messages[index] = msg;
                this.messageForm.reset();
              }
              this.createOrEdit = false;
              this.idMessages = 0;
              this.initPagination();
            }
            this.isShowBlockPage = false;
          },
          error: (err: Error) => {
            this.isShowBlockPage = false;
            this._toastService.add({type: "error", message: err.message, life: 5000})
            console.log(err)
          }
        })
      )
    } else {
      this.messageForm.markAllAsTouched();
      this._toastService.add({type: "warning", message: 'Complete todos', life: 5000})
    }
  }

  public sendForm(): void {
    if (this.idMessages === 0) {
      this.createMessage()
    } else {
      this.editMessage()
    }
  }

  createMessage() {
    if (this.messageForm.valid) {
      const msg = {
        ...this.messageForm.value,
        id: this.messages[this.messages.length - 1].id + 1

      }
      this.isShowBlockPage = true;
      this._messageService.createMsgService(msg).subscribe({
        next: (res) => {
          if (res.error) {
            this._toastService.add({type: "error", message: res.msg, life: 5000})
          } else {
            this.messages.push(res.data)
            this.createOrEdit = false;
            this.messageForm.reset();
            this.initPagination();
          }
          this.isShowBlockPage = false;
        },
        error: (err: Error) => {
          this.isShowBlockPage = false;
          this._toastService.add({type: "error", message: err.message, life: 5000})
          console.error(err.message)
        }
      })
    } else {
      this.messageForm.markAllAsTouched();
      this._toastService.add({type: "warning", message: 'Complete todos los campos correctamente', life: 5000})
    }

  }

  public editMsj(id: number): void {
    this.idMessages = id;
    this.createOrEdit = true;
    const msgEdit = this.messages.find((msg) => msg.id === id);
    if (msgEdit) {
      this.messageForm.patchValue(
        {
          eng: msgEdit.eng,
          spa: msgEdit.spa,
          type_message: msgEdit.type_message,
        }
      );

    }
  }

  cancelCloseDialog($event: boolean) {
    if ($event) {
      this.deleteMsg(this.idMessages);
    } else {
      this.showAlert = false;
      this.idMessages = 0;
    }
  }
  private initPagination(): void {
    this.leftLimit = 0;
    this.rightLimit = 10;
    this.paginationValue = 10;
    this.currentPg = 1;
    this.currentLengthPg = Math.ceil(this.messages.length / this.paginationValue);
    this.messagesPagination = this.messages.slice(this.leftLimit, this.rightLimit);
  }
  public beforePagination(): void {
    this.currentPg--;
    this.leftLimit -= this.paginationValue;
    this.rightLimit -= this.paginationValue;
    this.messagesPagination = this.messages.slice(this.leftLimit, this.rightLimit);
  }

  public nextPagination(): void {
    this.currentPg++;
    this.leftLimit = this.rightLimit;
    this.rightLimit += this.paginationValue;
    this.messagesPagination = this.messages.slice(this.leftLimit, this.rightLimit);
  }

  public resetPagination(event: any): void {
    this.paginationValue = event.target.value
    this.leftLimit = 0;
    this.rightLimit = this.paginationValue;
    this.currentPg = 1;
    this.currentLengthPg = Math.ceil(this.messages.length / this.paginationValue);
    this.messagesPagination = this.messages.slice(this.leftLimit, this.rightLimit);
  }
  showDelete(event: number) {
    this.idMessages = event;
    this.showAlert = true;

  }

  filterMessages(event: any) {
    const value = event.target.value;
    if (value && value.length ){
      const searchFields = ('eng' || 'spa' || 'id').split(',');
      this.messagesPagination = this.filterService.filter(this.messages,searchFields,value,"contains" )
    }
    else {
      this.initPagination();
    }
  }

  public exportPdf(): void {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default('landscape', 'mm', 'a4');
        this.exportColumns = ['id', 'eng', 'spa', 'type_message'];
        const msgOrder = this.messages.map( (document: any) => {
          return Object.keys(document).map( (key: string) => document[key]);
        });
        // @ts-ignore
        doc.autoTable({
          head: [this.exportColumns],
          body: msgOrder,
          theme: 'grid',
        })
        doc.save('messages.pdf');
      })
    })
  }

  public exportExcel(): void {
    // @ts-ignore
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet([...this.messages]);
      const workbook = {Sheets: {data: worksheet}, SheetNames: ['data']};
      const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
      this.saveAsExcelFile(excelBuffer, 'messages' || '');
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {type: ExcelType});
    saveAs(data, fileName + '_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  public exportCSV(): void {
    const replacer = (key: any, value: any) => (value === null ? '' : value);
    const header = ['id', 'eng', 'spa', 'type_message'];
    const csv = this.messages.map((row: any) => header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    const csvArray = csv.join('\r\n');
    const blob = new Blob([csvArray], {type: 'text/csv'});
    saveAs(blob, 'message' + '.csv');
  }


}


