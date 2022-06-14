import { Component, OnInit } from '@angular/core';
import {TableModel} from "@app/ui/components/table/model/table.model";
import {
  dataContent,
  showLoader, showToast,
  styleTableUser
} from "@app/modules/administration/modules/users/models/model-user/constans-user";
import {Response, Roles, User} from "@app/core/models";
import {Router} from "@angular/router";
import {UsersService} from "@app/modules/administration/modules/users/service/user/users.service";
import {DataContentUser} from "@app/modules/administration/modules/users/models/model-user/model-user";
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

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class UsersComponent implements OnInit {
  public showPassword: boolean = false;
  public styleTable: TableModel = styleTableUser;
  public users: User[] = [];
  public user: User;
  public userSelected: User = {};
  public contentModel: DataContentUser[] = dataContent
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
              private userService: UsersService,
              private _messageService: ToastService,
              private store: Store<AppState>,
              private confirmationService: ConfirmationService,
              private messageService: MessageService,

  )
  {
    this.showEdit = false;
    this.user = {};
    this.showLoader[0].value = false;
    this.secretKey = '';
  }


  ngOnInit(): void {
    this.getUsers();
    this.store.select('env').subscribe(
      (res) => {
        this.secretKey = res.env;
      },
    );
  }

  public getUsers(): void {
    this.styleTable.dataSource = [];
    this.showLoader[0].value = true;
    this._subscription.add(
      this.userService.getUsersByRolesAllow().subscribe((res) => {
        if (!res.error) {
          this.users = res.data;
          this.users.forEach((user: any) => {
            const newUser = {
              value: user,
              value1: user.username,
              value2: user.identification_number,
              value3: user.name+' '+user.last_name,
              value4: user.email_notifications,
              value5: user.status === 0 ? 'Desbloqueado' : 'Bloqueado',
              value6: user.roles !== null ? this.getRoles(user.roles) : 'Sin roles',
            }
            this.styleTable.dataSource?.push(newUser);
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
      this.user = resp.value;
      this.changeStatusContent();
    }
    if (resp.type === 'delete') {
      this.deleteUser(resp.value);
    }
    if (resp.type === 'lock') {
      this.confirmLockUnlock(resp.value);
    }
    if (resp.type === 'update-password') {
      this.showPassword = true;
      this.user = resp.value;
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

  private deleteUser(user: User): void {
    this.userSelected = user;
    this.showConfirmDelete = true;
  }

  public confirmLockUnlock(user: User) {
    if (user.status === 16) {
      this.confirmationService.confirm({
        message: '¿Desea desbloquear el usuario?',
        header: 'Confirmación de desbloqueo',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.lockUnlock(user);
        },
        reject: () => {
          alert('Info')
         this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
        },
      });
    } else if (user.status !== 16) {
      this.confirmationService.confirm({
        message: '¿Desea bloquear el usuario?',
        header: 'Confirmación de bloqueo',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.lockUnlock(user);
        },
        reject: () => {
         this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
        },
      });
    }
  }

  public lockUnlock(user: User) {
    if (user.status !== 16) {
      this.userService.blockUser(user.id!).subscribe((res: Response) => {
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
          user.status = 16;
          this.getUsers();
        }
      });
    } else {
      this.userService.unblockUser(user.id!).subscribe((res: Response) => {
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
          user.status = 1;
          this.getUsers();
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
      this.createUserOfFile(this.data);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  public async createUserOfFile(data: any[]) {
    this.showLoader[0].value = true;
    const ArrayUser: User[] = []
    const ArrayRoles: any[] = [];
    if (data.length) {
      data.forEach((us: any, index: number) => {
        if (index !== 0 && us.length) {
          const newUser: User = {
            id: uuidv4().toLowerCase(),
            username: us[0],
            email_notifications: us[1],
            identification_type: us[2],
            identification_number: String(us[3]),
            name: us[4],
            last_name: us[5],
            password:  encryptText(us[6], this.secretKey),
            password_comfirm: encryptText(us[6], this.secretKey),
          }
         ArrayRoles.push({id_user: us[4], roles: us[7]?.split(',')})
          ArrayUser.push(newUser);
        }
      })
      await Promise.all(ArrayUser).then((users: User[]) => {
        users.forEach((user: User) => {
          this._subscription.add(
            this.userService.createUser(user).subscribe((resp: Response) => {
              if (resp.error) {
                this.showLoader[0].value = false;
                this._messageService.add({
                  type: 'error',
                  message: resp.msg,
                  life: 5000,
                });
                this.dataExport.push(user)
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
        this.getUsers();
      })
    }
  }

  public showToast(data: any): void {
    this._messageService.add(data);
  }

  public getCreateAtMax() {
    // @ts-ignore
    this.dateMax = new Date(Math.max(...this.users.map((user: User) => new Date(user.created_at))));
  }

  export(): void {
    const ArrayObject:any = [];
    ArrayObject.push(['Nombre de Usuario','N° Identifiación', 'Apellidos Y nombres', 'Correo', 'Estado', 'Roles'])
    this.dataExport.filter((user: any) => {
      const ArrayTem = Object.values(user)
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
    const user = this.userSelected;
    if (event) {
      this.showLoader[0].value = true;
      this.userService.deleteUser(user.id!.toLowerCase()).subscribe((res: Response) => {
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

          this.userService.getUsersRolesByUserID(user.id!.toLowerCase()).subscribe((res: Response) => {
            if (res.error) {
              this.showLoader[0].value = false;
              this._messageService.add( {
                  type: 'error',
                  message: res.msg,
                  life: 5000,
                }
              );
            }else{
              if(res.data){
                let data = res.data;
                for(let item of data){
                  this.userService.deleteUsersRoles(item.id!.toLowerCase()).subscribe((res: Response) => {
                    if (res.error) {
                      this.showLoader[0].value = false;
                      this._messageService.add( {
                          type: 'error',
                          message: res.msg,
                          life: 5000,
                        }
                      );
                    }
                    if(item === data[data.length - 1]){
                      this.getUsers();
                      this.showLoader[0].value = false;
                    }
                  });
                }
              }else{
                this.showLoader[0].value = false;
                this.getUsers();
              }
            }
          });
        }
      });
    }else{
      this.userSelected = {};
    }
  }
}
