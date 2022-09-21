import { Component, OnInit } from '@angular/core';
import {TableModel} from "@app/ui/components/table/model/table.model";
import {
  dataContent,
  showLoader, showToast,
  styleTablePersonal
} from "@app/modules/administration/modules/personals/models/model-personal/constans-personal";
import {Response, Roles, Personal} from "@app/core/models";
import {Router} from "@angular/router";
import {DataContentPersonal} from "@app/modules/administration/modules/personals/models/model-personal/model-personal";
import {ToastService} from "ecapture-ng-ui";
import {ConfirmationService, Message, MessageService} from "primeng/api";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import * as XLSX from 'xlsx';
type AOA = any[][];
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import {encryptText} from "@app/core/utils/crypto/cypher";
import {Store} from "@ngrx/store";
import {AppState} from "@app/core/store/app.reducers";
import {Subscription} from "rxjs/internal/Subscription";
import {PersonalsService} from "@app/modules/administration/modules/personals/service/user/users.service";

@Component({
  selector: 'app-Personals',
  templateUrl: './personals.component.html',
  styleUrls: ['./personals.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class PersonalsComponent implements OnInit {
  public showPassword: boolean = false;
  public styleTable: TableModel = styleTablePersonal;
  public Personals: Personal[] = [];
  public Personal: Personal;
  public PersonalSelected: Personal = {};
  public contentModel: DataContentPersonal[] = dataContent
  public showEdit: boolean;
  public showLoader: any = showLoader;
  public toastStyle: ToastStyleModel = toastDataStyle;
  public dateMax = new Date();
  private _subscription: Subscription = new Subscription();
  public secretKey: string;
  public dataExport:any =[];
  msgs: Message[] = []
  data: AOA = [[1, 2], [3, 4]];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'Usuarios No creado.xlsx';
  public showConfirmDelete: boolean = false;

  constructor(private router: Router,
              private PersonalService: PersonalsService,
              private _messageService: ToastService,
              private store: Store<AppState>,
              private confirmationService: ConfirmationService,
              private messageService: MessageService,

  )
  {
    this.showEdit = false;
    this.Personal = {};
    this.showLoader[0].value = false;
    this.secretKey = '';
  }


  ngOnInit(): void {
    this.getPersonals();
    this.store.select('env').subscribe(
      (res) => {
        this.secretKey = res.env;
      },
    );
  }

  public getPersonals(): void {
    this.styleTable.dataSource = [];
    this.showLoader[0].value = true;
    this._subscription.add(
      this.PersonalService.getPersonalAll().subscribe((res: any) => {
        if (!res.error) {
          this.Personals = res.data;
          this.Personals.forEach((Personal: any) => {
            const newPersonal = {
              value: Personal,
              value1: Personal.dni,
              value2: Personal.Personalname,
              value3: Personal.names,
              value4: Personal.lastnames,
              value5: Personal.sexo === 'M' ? 'Masculino' : 'Femenino',
              value6: Personal.email,
            }
            this.styleTable.dataSource?.push(newPersonal);
          })
          this.getCreateAtMax();
          this.showLoader[0].value = false;
        } else {
          this.showLoader[0].value = false;
          this._messageService.add({
            type: 'error',
            message: 'Inicio de sesión fallido',
            life: 5000,
          });
        }
      })
    )
  }

  public getRoles(roles: Roles[]): string {
    let textTemp: string = '';
    if (roles.length) {
      roles.forEach((data: Roles, index:number)=>{
        if (data.name) {
          textTemp = textTemp + data.name + (index+1 !== roles.length ?', ':'');
        }
      })
    }
    return textTemp;
  }

  public eventTableOption(resp:any): void {
    if (resp.type === 'edit') {
      this.showEdit = true;
      this.Personal = resp.value;
      this.changeStatusContent();
    }
    if (resp.type === 'delete') {
      this.deletePersonal(resp.value);
    }
    if (resp.type === 'lock') {
      this.confirmLockUnlock(resp.value);
    }
    if (resp.type === 'update-password') {
      this.showPassword = true;
      this.Personal = resp.value;
    }
  }

  public changeStatusContent(): void {
    this.contentModel.forEach((item: any) => {
      item.status = !item.status;
    })
  }

  public showEventButtonTable(event: any): void {
    this.showEdit = false;
    this.changeStatusContent();
  }

  private deletePersonal(Personal: Personal): void {
    this.PersonalSelected = Personal;
    this.showConfirmDelete = true;
  }

  public confirmLockUnlock(Personal: Personal) {
    if (Personal.status === 16) {
      this.confirmationService.confirm({
        message: '¿Desea desbloquear el usuario?',
        header: 'Confirmación de desbloqueo',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.lockUnlock(Personal);
        },
        reject: () => {
          alert('Info')
         this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
        },
      });
    } else if (Personal.status !== 16) {
      this.confirmationService.confirm({
        message: '¿Desea bloquear el usuario?',
        header: 'Confirmación de bloqueo',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.lockUnlock(Personal);
        },
        reject: () => {
         this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
        },
      });
    }
  }

  public lockUnlock(Personal: Personal) {
    if (Personal.status !== 16) {
      this.PersonalService.blockPersonal('').subscribe((res: Response) => {
        if (res.error) {
          this._messageService.add( {
              type: 'error',
              message: res.msg,
              life: 5000,
            }
          );
        } else {
          this._messageService.add( {
              type: 'success',
              message: res.msg,
              life: 5000,
            }
          );
          Personal.status = 16;
          this.getPersonals();
        }
      });
    } else {
      this.PersonalService.unblockPersonal('').subscribe((res: Response) => {
        if (res.error) {
          this._messageService.add( {
              type: 'error',
              message: res.msg,
              life: 5000,
            }
          );
        } else {
          this._messageService.add( {
              type: 'success',
              message: res.msg,
              life: 5000,
            }
          );
          Personal.status = 1;
          this.getPersonals();
        }
      });
    }
  }

  public onFileExcel(event: any): void {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      this.createPersonalOfFile(this.data);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  public async createPersonalOfFile(data: any[]) {
    console.log(data)
    debugger
    this.showLoader[0].value = true;
    const ArrayPersonal: Personal[] = []
    const ArrayRoles: any[] = [];
    if (data.length) {
      data.forEach((us: any, index: number) => {
        debugger
        if (index !== 0 && us.length) {
          debugger
          const newPersonal: Personal = {
            dni: us[0],
            username: us[1],
            names: us[2],
            lastnames: us[3],
            email: us[4],
            sexo: us[5],
            date_birth:  us[6],
            date_admission: us[7],
          }
          debugger
         ArrayRoles.push({id_Personal: us[4], roles: us[7]?.split(',')})
          ArrayPersonal.push(newPersonal);
        }
      })
      await Promise.all(ArrayPersonal).then((Personals: Personal[]) => {
        Personals.forEach((Personal: Personal) => {
          this._subscription.add(
            this.PersonalService.createPersonal(Personal).subscribe((resp: any) => {
              if (resp.error) {
                this.showLoader[0].value = false;
                this._messageService.add({
                  type: 'error',
                  message: resp.msg,
                  life: 5000,
                });
                this.dataExport.push(Personal)
              } else {
                this.showLoader[0].value = false;
                this._messageService.add({
                  type: 'success',
                  message: resp.msg,
                  life: 5000,
                });
              }
            })
          );

        })
        this.getPersonals();
      })
    }
  }

  public showToast(data: any): void {
    this._messageService.add(data);
  }

  public getCreateAtMax() {
    // @ts-ignore
    this.dateMax = new Date(Math.max(...this.Personals.map((Personal: Personal) => new Date(Personal.created_at))));
  }

  export(): void {
    const ArrayObject:any = [];
    ArrayObject.push(['Nombre de Usuario','N° Identifiación', 'Apellidos Y nombres', 'Correo', 'Estado', 'Roles'])
    this.dataExport.filter((Personal: any) => {
      const ArrayTem = Object.values(Personal)
      ArrayTem.shift();
      ArrayObject.push(ArrayTem);
    })
    // @ts-ignore
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(ArrayObject);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Roles Exportados');

    XLSX.writeFile(wb, this.fileName);
    this.dataExport = [];
  }

  confirmDialogDelete(event: boolean) {
    this.showConfirmDelete = false;
    const Personal = this.PersonalSelected;
    if (event) {
      this.showLoader[0].value = true;
      this.PersonalService.deletePersonal(Personal).subscribe((res: any) => {
        if (res.error) {
          this.showLoader[0].value = false;
          this._messageService.add( {
              type: 'error',
              message: res.msg,
              life: 5000,
            }
          );
        } else {
          this._messageService.add({
            type: 'success',
            message: res.msg,
            life: 5000,
          });

          this.getPersonals()
          this.showLoader[0].value = false;
        }
      });
    }else{
      this.PersonalSelected = {};
    }
  }
}
