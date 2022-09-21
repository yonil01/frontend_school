import { Component, OnInit } from '@angular/core';
import {TableModel} from "@app/ui/components/table/model/table.model";
import {styleTableFirst} from "@app/modules/wizard/dynamic-forms/models/constans";
import {Router} from "@angular/router";
import {styleTableUser} from "@app/modules/administration/modules/teacher/models/model-teacher/constans-teacher";
import {User} from "@app/core/models";
import {Teacherelect} from "@app/modules/administration/modules/teacher/models/teacher-crud-model/teacher-crud-constans";
import {TeacherService} from "@app/modules/administration/modules/teacher/service/user/users.service";

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.scss']
})
export class TeacherListComponent implements OnInit {
  public styleTable: TableModel = styleTableUser;
  public Teacher: User[] = [];
  public Teacherelect: any = Teacherelect;
  constructor(private router: Router,private Teacherervice: TeacherService,) { }

  ngOnInit(): void {

    this.getTeacher();
  }

  public  getTeacher(): void {
    this.styleTable.dataSource = [];
    this.Teacherervice.getTeacherByRolesAllow().subscribe((res: any) => {
      if (!res.error) {
        this.Teacher = res.data;
        this.Teacher.forEach((user: any) => {
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
