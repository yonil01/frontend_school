import { Component, OnInit } from '@angular/core';
import {TableModel} from "@app/ui/components/table/model/table.model";
import {
  dataContent,
  showLoader, showToast,
  styleTableUser
} from "@app/modules/administration/modules/users/models/model-user/constans-user";
import {Response, User} from "@app/core/models";
import {Router} from "@angular/router";
import {UsersService} from "@app/modules/administration/modules/users/service/user/users.service";
import {DataContentUser} from "@app/modules/administration/modules/users/models/model-user/model-user";
import {ToastService} from "ecapture-ng-ui";
import {ConfirmationService} from "primeng/api";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import * as XLSX from 'xlsx';
type AOA = any[][];
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import {encryptText} from "@app/core/utils/crypto/cypher";
import {Store} from "@ngrx/store";
import {AppState} from "@app/core/store/app.reducers";


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  public showPassword: boolean = false;
  public styleTable: TableModel = styleTableUser;
  public users: User[] = [];
  public user: User;
  public contentModel: DataContentUser[] = dataContent
  public showEdit: boolean;
  public showLoader: any = showLoader;
  public toastStyle: ToastStyleModel = toastDataStyle;
  public dateMax = new Date();
  public secretKey: string;

  data: AOA = [[1, 2], [3, 4]];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';

  constructor(private router: Router,
              private userService: UsersService,
              private _messageService: ToastService,
              private store: Store<AppState>,

              //private confirmationService: ConfirmationService,
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

  public  getUsers(): void {
    this.styleTable.dataSource = [];
    this.showLoader[0].value = true;
    this.userService.getUsersByRolesAllow().subscribe((res) => {
      if (!res.error) {
        this.users = res.data;
        this.users.forEach((user: any) => {
          const newUser = {
            value: user,
            value1: user.identification_number,
            value2: user.last_name,
            value3: user.email_notifications,
            value4: user.status === 0 ? 'Desbloqueado' : 'Bloqueado',
            value5: user.roles ? user.roles[0].name : '',
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
    });
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
    this.userService.deleteUser(user.id!.toLowerCase()).subscribe((res: Response) => {
      if (res.error) {
        this._messageService.add( {
            type: 'success',
            message: res.msg,
            life: 5000,
          }
        );
      } else {
        this._messageService.add({
          type: 'error',
          message: res.msg,
          life: 5000,
        });
        this.getUsers();
      }
    });
  }

  public confirmLockUnlock(user: User) {
    this._messageService.add({
      type: 'error',
      message: 'Hello',
      life: 5000,
    });
    /*if (user.status === 16) {
      this.confirmationService.confirm({
        message: '¿Desea desbloquear el usuario?',
        header: 'Confirmación de desbloqueo',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.lockUnlock(user);
        },
        reject: () => {
          alert('Info')
         // this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
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
          alert('Info')
        //  this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
        },
      });
    }*/
  }

  /*public lockUnlock(user: User) {
    if (user.status !== 16) {
      this.userService.blockUser(user.id!).subscribe((res: Response) => {
        if (res.error) {
          alert(res.msg);
         // this.notifyUser('error', '', res.msg, 5000);
        } else {
          alert(res.msg);
         // this.notifyUser('success', '', res.msg, 5000);
          user.status = 16;
          this.getUsers();
        }
      });
    } else {
      this.userService.unblockUser(user.id!).subscribe((res: Response) => {
        if (res.error) {
          alert(res.msg);
          // this.notifyUser('error', '', res.msg, 5000);
        } else {
          alert(res.msg);
         // this.notifyUser('success', '', res.msg, 5000);
          user.status = 1;
          this.getUsers();
        }
      });
    }
  }*/

  public onFileExcel(event: any): void {
    debugger
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

  public createUserOfFile(data: any[]):void {
    this.showLoader[0].value = true;
    const ArrayUser: User[] = []
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
          ArrayUser.push(newUser);
        }
      })
      Promise.all(ArrayUser).then((users: User[]) => {
        users.forEach((user: User) => {
          this.userService.createUser(user).subscribe((resp: Response) => {
            debugger
            if (resp.error) {
              this.showLoader[0].value = false;
              this._messageService.add({
                type: 'error',
                message: resp.msg,
                life: 5000,
              });
            } else {
              this.showLoader[0].value = false;
              this._messageService.add({
                type: 'success',
                message: resp.msg,
                life: 5000,
              });
            }
          });
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
}
