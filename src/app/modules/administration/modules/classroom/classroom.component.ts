import { Component, OnInit } from '@angular/core';
import {TableModel} from "@app/ui/components/table/model/table.model";
import {
  dataContent,
  showLoader, showToast,
  styleTableClassroom
} from "@app/modules/administration/modules/classroom/models/model-classroom/constans-classroom";
import {Response, Roles, Classroom} from "@app/core/models";
import {Router} from "@angular/router";
import {DataContentClassroom} from "@app/modules/administration/modules/classroom/models/model-classroom/model-classroom";
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
import {ClassroomsService} from "@app/modules/administration/modules/classroom/service/classroom/classroom.service";

@Component({
  selector: 'app-Classrooms',
  templateUrl: './classroom.component.html',
  styleUrls: ['./classroom.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class ClassroomComponent implements OnInit {
  public showPassword: boolean = false;
  public styleTable: TableModel = styleTableClassroom;
  public Classrooms: Classroom[] = [];
  public Classroom: Classroom;
  public ClassroomSelected: Classroom = {};
  public contentModel: DataContentClassroom[] = dataContent
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
              private ClassroomService: ClassroomsService,
              private _messageService: ToastService,
              private store: Store<AppState>,
              private confirmationService: ConfirmationService,
              private messageService: MessageService,

  )
  {
    this.showEdit = false;
    this.Classroom = {};
    this.showLoader[0].value = false;
    this.secretKey = '';
  }


  ngOnInit(): void {
    this.getClassrooms();
    this.store.select('env').subscribe(
      (res) => {
        this.secretKey = res.env;
      },
    );
  }

  public getClassrooms(): void {
    this.styleTable.dataSource = [];
    this.showLoader[0].value = true;
    this._subscription.add(
      this.ClassroomService.getClassroomAll().subscribe((res: any) => {
        if (!res.error) {
          this.Classrooms = res.data;
          this.Classrooms.forEach((Classroom: any) => {
            const newClassroom = {
              value: Classroom,
              value1: Classroom.name,
              value2: Classroom.description,
              value3: Classroom.nivel,
              value4: Classroom.status ===1 ? 'Activo':'Desactivo',
              value5: Classroom.grado ,
              value6: Classroom.section,
            }
            this.styleTable.dataSource?.push(newClassroom);
          })
          this.getCreateAtMax();
          this.showLoader[0].value = false;
        } else {
          this.showLoader[0].value = false;
          this._messageService.add({
            type: 'error',
            message: 'Inicio de sesi??n fallido',
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
      this.Classroom = resp.value;
      this.changeStatusContent();
    }
    if (resp.type === 'delete') {
      this.deleteClassroom(resp.value);
    }
    if (resp.type === 'lock') {
      this.confirmLockUnlock(resp.value);
    }
    if (resp.type === 'update-password') {
      this.showPassword = true;
      this.Classroom = resp.value;
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

  private deleteClassroom(Classroom: Classroom): void {
    this.ClassroomSelected = Classroom;
    this.showConfirmDelete = true;
  }

  public confirmLockUnlock(Classroom: Classroom) {
    if (Classroom.status === 16) {
      this.confirmationService.confirm({
        message: '??Desea desbloquear el usuario?',
        header: 'Confirmaci??n de desbloqueo',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.lockUnlock(Classroom);
        },
        reject: () => {
          alert('Info')
         this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
        },
      });
    } else if (Classroom.status !== 16) {
      this.confirmationService.confirm({
        message: '??Desea bloquear el usuario?',
        header: 'Confirmaci??n de bloqueo',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.lockUnlock(Classroom);
        },
        reject: () => {
         this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
        },
      });
    }
  }

  public lockUnlock(Classroom: Classroom) {
    if (Classroom.status !== 16) {
      this.ClassroomService.blockClassroom('').subscribe((res: Response) => {
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
          Classroom.status = 16;
          this.getClassrooms();
        }
      });
    } else {
      this.ClassroomService.unblockClassroom('').subscribe((res: Response) => {
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
          Classroom.status = 1;
          this.getClassrooms();
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
      this.createClassroomOfFile(this.data);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  public async createClassroomOfFile(data: any[]) {
    console.log(data)
    debugger
    this.showLoader[0].value = true;
    const ArrayClassroom: Classroom[] = []
    const ArrayRoles: any[] = [];
    if (data.length) {
      data.forEach((us: any, index: number) => {
        debugger
        if (index !== 0 && us.length) {
          debugger
          const newClassroom: Classroom = {
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
         ArrayRoles.push({id_Classroom: us[4], roles: us[7]?.split(',')})
          ArrayClassroom.push(newClassroom);
        }
      })
      await Promise.all(ArrayClassroom).then((Classrooms: Classroom[]) => {
        Classrooms.forEach((Classroom: Classroom) => {
          this._subscription.add(
            this.ClassroomService.createClassroom(Classroom).subscribe((resp: any) => {
              if (resp.error) {
                this.showLoader[0].value = false;
                this._messageService.add({
                  type: 'error',
                  message: resp.msg,
                  life: 5000,
                });
                this.dataExport.push(Classroom)
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
        this.getClassrooms();
      })
    }
  }

  public showToast(data: any): void {
    this._messageService.add(data);
  }

  public getCreateAtMax() {
    // @ts-ignore
    this.dateMax = new Date(Math.max(...this.Classrooms.map((Classroom: Classroom) => new Date(Classroom.created_at))));
  }

  export(): void {
    const ArrayObject:any = [];
    ArrayObject.push(['Nombre de Usuario','N?? Identifiaci??n', 'Apellidos Y nombres', 'Correo', 'Estado', 'Roles'])
    this.dataExport.filter((Classroom: any) => {
      const ArrayTem = Object.values(Classroom)
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
    const Classroom = this.ClassroomSelected;
    if (event) {
      this.showLoader[0].value = true;
      this.ClassroomService.deleteClassroom(Classroom).subscribe((res: any) => {
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

          this.getClassrooms()
          this.showLoader[0].value = false;
        }
      });
    }else{
      this.ClassroomSelected = {};
    }
  }
}
