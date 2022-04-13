import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  PasswordNotAllowedService
} from "@app/modules/administration/modules/passwords-not-allowed/services/password-not-allowed.service";
import {Subscription} from "rxjs/internal/Subscription";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastService} from "ecapture-ng-ui";
import {Parameters} from "@app/modules/administration/modules/parameters/models/parameters.models";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {FilterService} from "@app/ui/services/filter.service";
import {ExcelType} from "@app/ui/utils/constants/constants";
import {saveAs} from "file-saver";


interface Password {
  id?: number;
  password: string
}

@Component({
  selector: 'app-passwords-not-allowed-list',
  templateUrl: './passwords-not-allowed-list.component.html',
  styleUrls: ['./passwords-not-allowed-list.component.scss']
})
export class PasswordsNotAllowedListComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();


  public passwords: Password[] = [];
  public formPasswordNotAllowedService: FormGroup;
  public isShowBlockPage: boolean = false;
  public isEditOrCreate: boolean = false;
  public idPassword: number= 0;
  public showAlert: boolean = false;
  public toastStyle: ToastStyleModel = toastDataStyle;
  public passwordPagination: Password[]= [];
  public passwordsFilter: Password[] = [];
  public exportColumns: any[] = [];



  constructor(
    private passwordNotAllowedService: PasswordNotAllowedService,
    private _fb: FormBuilder,
    private _messageService: ToastService,
    private filterService: FilterService,

  ) {
    this.formPasswordNotAllowedService = _fb.group({
      password:['',Validators.required]
    });

    this.isShowBlockPage = true;
    this.subscription.add(
      this.passwordNotAllowedService.getPwdNotAllowed().subscribe(
        {
          next: (res) => {
            if (res.error) {
              this._messageService.add({type: 'error', message: res.msg, life: 5000});
            } else {
              if (res.data) {
                this.passwords = res.data;
                this.passwordsFilter = res.data;
              }
            }
            this.isShowBlockPage = false;
          },
          error: (err: Error) => {
            this._messageService.add({type: 'error', message: 'Hubo un error al obtener la informacion', life: 5000});
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

  public  deletePwdNotAllowed():void{
    this.isShowBlockPage = true;
    this.showAlert = false;
    this.subscription.add(
      this.passwordNotAllowedService.DeleteBlackListPwd(this.idPassword).subscribe({
        next: (res ) => {
          if (res.error) {
            this._messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            this.passwords = this.passwords.filter((password) => password.id);
            this.idPassword =0;
            this.passwordsFilter =[...this.passwords];
          }
          this.isShowBlockPage = false;
        },
        error: (err: Error) => {
          this.isShowBlockPage = false;
          console.error(err.message);
          this._messageService.add({type: 'error', message: 'Hubo un error a la hora de obtener la infomación!', life: 5000});
        }
      })
    );
  }
  private createBlackListPwd(): void {
    if (this.formPasswordNotAllowedService.valid) {
      const password= this.formPasswordNotAllowedService.value.password.toString()

      this.isShowBlockPage = true;
      this.subscription.add(
        this.passwordNotAllowedService.CreateBlackListPwd(password).subscribe(
          {
            next: (res) => {
              if (res.error) {
                this._messageService.add({type: 'warning', message: res.msg, life: 5000});
              } else {
                this.isEditOrCreate = false;
                this.passwords.push(res.data);
                this.formPasswordNotAllowedService.reset();
                this.passwordsFilter =[...this.passwords];
              }
              this.isShowBlockPage = false;
            },
            error: (err: Error) => {
              this.isShowBlockPage = false;
              console.error(err.message);
              this._messageService.add({
                type: 'warning',
                message: 'Hubo un problema al tratar de obtener la información!',
                life: 5000
              });
            }
          }
        )
      )
    } else {
      this._messageService.add({type: 'warning', message: 'Complete todos los campos correctamente', life: 5000});
      this.formPasswordNotAllowedService.markAllAsTouched();
    }
  }

  private updateBlackListPwd(): void {
    if (this.formPasswordNotAllowedService.valid) {
      const password={
        password:this.formPasswordNotAllowedService.value.password.toString(),
        id:this.idPassword
      }
      this.isShowBlockPage = true;
      this.subscription.add(
        this.passwordNotAllowedService.UpdateBlackListPwd(password).subscribe(
          {
            next: (res) => {
              if (res.error) {
                this._messageService.add({type: 'warning', message: res.msg, life: 5000});
              } else {
                const indexParameter = this.passwords.findIndex(item => item.id === this.idPassword);
                if (indexParameter !== -1) {
                  this.passwords[indexParameter] = password;
                  this.formPasswordNotAllowedService.reset();
                  this.idPassword = 0;

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
                message: 'Hubo un problema al traer la información!',
                life: 5000
              });
            }
          }
        )
      )
    } else {
      this._messageService.add({type: 'warning', message: 'Complete todos los campos correctamente', life: 5000});
      this.formPasswordNotAllowedService.markAllAsTouched();
    }
  }




  public sendForm(): void {
    if (this.idPassword === 0) {
      this.createBlackListPwd();
    } else {
      this.updateBlackListPwd();
    }
  }


  public isEdit(id: number): void {
    this.isEditOrCreate = true;
    const password = this.passwords.find(item => item.id === id);
    if (password) {
      this.idPassword = id;
      this.formPasswordNotAllowedService.get("password")?.setValue(password.password);
    }
  }
  showDelete(event: number) {
    this.idPassword = event;
    this.showAlert = true;

  }
  cancelCloseDialog($event: boolean) {
    if ($event) {
      this.deletePwdNotAllowed();

    } else {
      this.showAlert = false;
      this.idPassword = 0;
    }
  }
  filterMessages(event: any) {
    const value = event.target.value;
    if (value && value.length ){
      const searchFields = ('id,password').split(',');
      this.passwordsFilter = this.filterService.filter(this.passwords,searchFields,value,"contains" )
    }
    else {
      this.passwordsFilter = [...this.passwords];
    }
  }

  public exportPdf(): void {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default('landscape', 'mm', 'a4');
        this.exportColumns = ['ip', 'description'];
        const passwordsOrder = this.passwords.map((document: any) => {
          return Object.keys(document).map((key: string) => document[key]);
        });
        // @ts-ignore
        doc.autoTable({
          head: [this.exportColumns],
          body: passwordsOrder,
          theme: 'grid',
        })
        doc.save('messages.pdf');
      })
    })
  }

  public exportExcel(): void {
    // @ts-ignore
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet([...this.passwords]);
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
    const csv = this.passwords.map((row: any) => header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    const csvArray = csv.join('\r\n');
    const blob = new Blob([csvArray], {type: 'text/csv'});
    saveAs(blob, 'whiteList' + '.csv');
  }
}
