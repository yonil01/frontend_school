import { Component, OnInit } from '@angular/core';
import {TableModel} from "@app/ui/components/table/model/table.model";
import {styleTableFirst} from "@app/modules/wizard/dynamic-forms/models/constans";
import {Router} from "@angular/router";
import {styleTableUser} from "@app/modules/administration/modules/users/models/model-user/constans-user";
import {UsersService} from "@app/modules/administration/modules/users/service/user/users.service";
import {User} from "@app/core/models";
import {userSelect} from "@app/modules/administration/modules/users/models/user-crud-model/user-crud-constans";

@Component({
  selector: 'app-teacher-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  public styleTable: TableModel = styleTableUser;
  public users: User[] = [];
  public userSelect: any = userSelect;
  constructor(private router: Router,private userService: UsersService,) { }

  ngOnInit(): void {

    this.getUsers();
  }

  public  getUsers(): void {
    this.styleTable.dataSource = [];
    this.userService.getUsersByRolesAllow().subscribe((res) => {
      if (!res.error) {
        this.users = res.data;
        this.users.forEach((user: any) => {
          const newUser = {
            id: user.id,
            value1: user.identification_number,
            value2: user.last_name,
            value3: user.email_notifications,
            value4: user.status === 0 ? 'Desbloqueado' : 'Bloqueado',
            value5: user.roles ? user.roles[0].name : '',
          }
          this.styleTable.dataSource?.push(newUser);
        })
      }
    });
  }

  public eventTableOption(data:any): void {
    if (data.type === 'edit') {
      this.router.navigate(['/admin/subject/detail'])
    }
    if (data.type === 'normally') {
      this.router.navigate(['/wizard/dymanic-forms/configuration'])
    }
    if (data.type === 'normally') {
      this.router.navigate(['/wizard/dymanic-forms/configuration'])
    }
    if (data.type === 'normally') {
      this.router.navigate(['/wizard/dymanic-forms/configuration'])
    }
  }
}
