import { Component, OnInit } from '@angular/core';
import {TableModel} from "@app/ui/components/table/model/table.model";
import {
  dataContent,
  showLoader, showToast,
  styleTableSubject
} from "@app/modules/administration/modules/subject/models/model-subject/constans-subject";
import {Response, Roles, Subject} from "@app/core/models";
import {Router} from "@angular/router";
import {DataContentSubject} from "@app/modules/administration/modules/subject/models/model-subject/model-subject";
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
import {SubjectsService} from "@app/modules/administration/modules/subject/service/subject/subject.service";

@Component({
  selector: 'app-Subjects',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class SubjectComponent implements OnInit {
  public showPassword: boolean = false;
  public styleTable: TableModel = styleTableSubject;
  public Subjects: Subject[] = [];
  public Subject: Subject;
  public SubjectSelected: Subject = {};
  public contentModel: DataContentSubject[] = dataContent
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
              private SubjectService: SubjectsService,
              private _messageService: ToastService,
              private store: Store<AppState>,
              private confirmationService: ConfirmationService,
              private messageService: MessageService,

  )
  {
    this.showEdit = false;
    this.Subject = {};
    this.showLoader[0].value = false;
    this.secretKey = '';
  }


  ngOnInit(): void {
    this.getSubjects();
    this.store.select('env').subscribe(
      (res) => {
        this.secretKey = res.env;
      },
    );
  }

  public getSubjects(): void {
    this.styleTable.dataSource = [];
    this.showLoader[0].value = true;
    this._subscription.add(
      this.SubjectService.getSubjectAll().subscribe((res: any) => {
        if (!res.error) {
          this.Subjects = res.data;
          this.Subjects.forEach((Subject: any) => {
            const newSubject = {
              value: Subject,
              value1: Subject.name,
              value2: Subject.description,
            }
            this.styleTable.dataSource?.push(newSubject);
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
      this.Subject = resp.value;
      this.changeStatusContent();
    }
    if (resp.type === 'delete') {
      this.deleteSubject(resp.value);
    }
    if (resp.type === 'lock') {
      this.confirmLockUnlock(resp.value);
    }
    if (resp.type === 'update-password') {
      this.showPassword = true;
      this.Subject = resp.value;
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

  private deleteSubject(Subject: Subject): void {
    this.SubjectSelected = Subject;
    this.showConfirmDelete = true;
  }

  public confirmLockUnlock(Subject: Subject) {
    if (Subject.status === 16) {
      this.confirmationService.confirm({
        message: '¿Desea desbloquear el usuario?',
        header: 'Confirmación de desbloqueo',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.lockUnlock(Subject);
        },
        reject: () => {
          alert('Info')
         this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
        },
      });
    } else if (Subject.status !== 16) {
      this.confirmationService.confirm({
        message: '¿Desea bloquear el usuario?',
        header: 'Confirmación de bloqueo',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.lockUnlock(Subject);
        },
        reject: () => {
         this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
        },
      });
    }
  }

  public lockUnlock(Subject: Subject) {
    if (Subject.status !== 16) {
      this.SubjectService.blockSubject('').subscribe((res: Response) => {
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
          Subject.status = 16;
          this.getSubjects();
        }
      });
    } else {
      this.SubjectService.unblockSubject('').subscribe((res: Response) => {
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
          Subject.status = 1;
          this.getSubjects();
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
      this.createSubjectOfFile(this.data);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  public async createSubjectOfFile(data: any[]) {
    console.log(data)
    debugger
    this.showLoader[0].value = true;
    const ArraySubject: Subject[] = []
    const ArrayRoles: any[] = [];
    if (data.length) {
      data.forEach((us: any, index: number) => {
        debugger
        if (index !== 0 && us.length) {
          debugger
          const newSubject: Subject = {
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
         ArrayRoles.push({id_Subject: us[4], roles: us[7]?.split(',')})
          ArraySubject.push(newSubject);
        }
      })
      await Promise.all(ArraySubject).then((Subjects: Subject[]) => {
        Subjects.forEach((Subject: Subject) => {
          this._subscription.add(
            this.SubjectService.createSubject(Subject).subscribe((resp: any) => {
              if (resp.error) {
                this.showLoader[0].value = false;
                this._messageService.add({
                  type: 'error',
                  message: resp.msg,
                  life: 5000,
                });
                this.dataExport.push(Subject)
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
        this.getSubjects();
      })
    }
  }

  public showToast(data: any): void {
    this._messageService.add(data);
  }

  public getCreateAtMax() {
    // @ts-ignore
    this.dateMax = new Date(Math.max(...this.Subjects.map((Subject: Subject) => new Date(Subject.created_at))));
  }

  export(): void {
    const ArrayObject:any = [];
    ArrayObject.push(['Nombre de Usuario','N° Identifiación', 'Apellidos Y nombres', 'Correo', 'Estado', 'Roles'])
    this.dataExport.filter((Subject: any) => {
      const ArrayTem = Object.values(Subject)
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
    const Subject = this.SubjectSelected;
    if (event) {
      this.showLoader[0].value = true;
      this.SubjectService.deleteSubject(Subject).subscribe((res: any) => {
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

          this.getSubjects()
          this.showLoader[0].value = false;
        }
      });
    }else{
      this.SubjectSelected = {};
    }
  }
}
