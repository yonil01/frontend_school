import {Component, OnDestroy, OnInit} from '@angular/core';
import {WhiteListService} from "@app/modules/administration/modules/white-list/services/white-list.service";
import {Subscription} from "rxjs/internal/Subscription";
import {WhiteList} from "@app/modules/administration/modules/white-list/models/white-list.models";
import {ToastService} from "ecapture-ng-ui";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {FilterService} from "@app/ui/services/filter.service";
import {ExcelType} from "@app/ui/utils/constants/constants";
import {saveAs} from "file-saver";

@Component({
  selector: 'app-white-list-page',
  templateUrl: './white-list-page.component.html',
  styleUrls: ['./white-list-page.component.scss']
})
export class WhiteListPageComponent implements OnInit, OnDestroy  {

  private subscription: Subscription = new Subscription();
  public showAlert: boolean = false;
  public whiteLists: WhiteList[] = [];

  public isShowBlockPage: boolean = false;
  public toastStyle: ToastStyleModel = toastDataStyle;
  public whiteListPagination: WhiteList[] = [];
  public whiteListFilter: WhiteList[] = [];
  public formWhiteList: FormGroup;
  public exportColumns: any[] = [];
  public isEditOrCreate: boolean = false;
  public idWhiteList: number = 0;

  constructor(
    private whiteListService: WhiteListService,
    private _messageService: ToastService,
    private _fb: FormBuilder,
    private filterService: FilterService
  ) {
    this.formWhiteList = _fb.group({
      ip: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      description: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    });
    this.isShowBlockPage = true;
    this.subscription.add(
      this.whiteListService.getWhiteList().subscribe(
        {
          next: (res) => {
            if (res.error) {
              this._messageService.add({type: 'error', message: res.msg, life: 5000});
            } else {
              if (res.data) {
                this.whiteLists = res.data;
                this.whiteListFilter = res.data;
              }
            }
            this.isShowBlockPage = false;
          },
          error: (err: Error) => {
            this._messageService.add({
              type: 'error',
              message: 'Hubo un error a la hora de obtener la infomación!',
              life: 5000
            });
            console.error(err.message);
            this.isShowBlockPage = false;
          }
        }
      )
    )
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public deleteWhiteList(id: number): void {
    this.isShowBlockPage = true;
    this.subscription.add(
      this.whiteListService.deleteWhiteList(id).subscribe({
        next: (res) => {
          if (res.error) {
            this._messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            this.whiteLists = this.whiteLists.filter((whiteList) => whiteList.id !== id);
            this.whiteListFilter = [...this.whiteLists];
          }
          this.isShowBlockPage = false;
          this.showAlert = false;
        },
        error: (err: Error) => {
          this.showAlert = false;
          this.isShowBlockPage = false;
          console.error(err.message);
          this._messageService.add({
            type: 'error',
            message: 'Hubo un error a la hora de obtener la infomación!',
            life: 5000
          });
        }
      })
    );
  }

  private createWhiteList(): void {
    if (this.formWhiteList.valid) {
      const whiteList: WhiteList = {
        ...this.formWhiteList.value
      }
      this.isShowBlockPage = true;
      this.subscription.add(
        this.whiteListService.createWhiteList(whiteList).subscribe(
          {
            next: (res) => {
              if (res.error) {
                this._messageService.add({type: 'warning', message: res.msg, life: 5000});
              } else {
                this.isEditOrCreate = false;
                this.whiteLists.push(res.data);
                this.formWhiteList.reset();
                this.whiteListFilter = [...this.whiteLists];
              }
              this.isShowBlockPage = false;
            },
            error: (err: Error) => {
              this.isShowBlockPage = false;
              console.error(err.message);
              this._messageService.add({
                type: 'warning',
                message: 'Hubo un problema cuando se trato de obtener la información!',
                life: 5000
              });
            }
          }
        )
      )
    } else {
      this._messageService.add({type: 'warning', message: 'Complete todos los campos correctamente', life: 5000});
      this.formWhiteList.markAllAsTouched();
    }
  }

  public sendForm(): void {
    if (this.idWhiteList === 0) {
      this.createWhiteList();
    } else {
      this.updateWhiteList();
    }
  }

  private updateWhiteList(): void {
    if (this.formWhiteList.valid) {
      const whiteList: WhiteList = {
        id: this.idWhiteList,
        ...this.formWhiteList.value
      }
      this.isShowBlockPage = true;
      this.subscription.add(
        this.whiteListService.updateWhiteLists(whiteList).subscribe(
          {
            next: (res) => {
              if (res.error) {
                this._messageService.add({type: 'warning', message: res.msg, life: 5000});
              } else {
                const indexWhiteList = this.whiteLists.findIndex(item => item.id === this.idWhiteList);
                if (indexWhiteList !== -1) {
                  this.whiteLists[indexWhiteList] = whiteList;
                  this.formWhiteList.reset();
                  this.idWhiteList = 0;
                }
                this.isEditOrCreate = false;
              }
              this.isShowBlockPage = false;
            },
            error: (err: Error) => {
              this.isShowBlockPage = false;
              console.error(err.message);
              this._messageService.add({
                type: 'warning',
                message: 'Hubo un problema cuando se trato de obtener la información!',
                life: 5000
              });
            }
          }
        )
      )
    } else {
      this._messageService.add({type: 'warning', message: 'Complete todos los campos correctamente', life: 5000});
      this.formWhiteList.markAllAsTouched();
    }
  }

  public isEdit(id: number): void {
    this.isEditOrCreate = true;
    const whiteList= this.whiteLists.find(item => item.id === id);
    if (whiteList) {
      this.idWhiteList = id;
      this.formWhiteList.patchValue(whiteList);
    }
  }

  cancelCloseDialog($event: boolean) {
    if ($event) {
      this.deleteWhiteList(this.idWhiteList);

    } else {
      this.showAlert = false;
      this.idWhiteList = 0;
    }
  }

  showDelete(event: number) {
    this.idWhiteList = event;
    this.showAlert = true;

  }

  filterMessages(event: any) {
    const value = event.target.value;
    if (value && value.length) {
      const searchFields: string[] = ('description,ip,id').split(',');
      this.whiteListFilter = this.filterService.filter(this.whiteLists, searchFields, value, "contains")
    } else {
      this.whiteListFilter = [...this.whiteLists];
    }
  }

  public exportPdf(): void {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default('landscape', 'mm', 'a4');
        this.exportColumns = ['ip', 'description'];
        const whiteListOrder = this.whiteLists.map((document: any) => {
          return Object.keys(document).map((key: string) => document[key]);
        });
        // @ts-ignore
        doc.autoTable({
          head: [this.exportColumns],
          body: whiteListOrder,
          theme: 'grid',
        })
        doc.save('messages.pdf');
      })
    })
  }

  public exportExcel(): void {
    // @ts-ignore
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet([...this.whiteLists]);
      const workbook = {Sheets: {data: worksheet}, SheetNames: ['data']};
      const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
      this.saveAsExcelFile(excelBuffer, 'whiteList' || '');
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {type: ExcelType});
    saveAs(data, fileName + '_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  public exportCSV(): void {
    const replacer = (key: any, value: any) => (value === null ? '' : value);
    const header = ['ip', 'description'];
    const csv = this.whiteLists.map((row: any) => header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    const csvArray = csv.join('\r\n');
    const blob = new Blob([csvArray], {type: 'text/csv'});
    saveAs(blob, 'whiteList' + '.csv');
  }

}
