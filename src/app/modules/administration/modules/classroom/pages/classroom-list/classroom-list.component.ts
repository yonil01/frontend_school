import { Component, OnInit } from '@angular/core';
import {TableModel} from "@app/ui/components/table/model/table.model";
import {styleTableFirst} from "@app/modules/wizard/dynamic-forms/models/constans";
import {Router} from "@angular/router";
import {styleTableClassroom} from "@app/modules/administration/modules/classroom/models/model-classroom/constans-classroom";
import {Classroom, User} from "@app/core/models";
import {ClassroomSelect} from "@app/modules/administration/modules/classroom/models/classroom-crud-model/classroom-crud-constans";
import {ClassroomsService} from "@app/modules/administration/modules/classroom/service/classroom/classroom.service";

@Component({
  selector: 'app-teacher-list',
  templateUrl: './classroom-list.component.html',
  styleUrls: ['./classroom-list.component.scss']
})
export class ClassroomListComponent implements OnInit {
  public styleTable: TableModel = styleTableClassroom;
  public Classrooms: Classroom[] = [];
  public ClassroomSelect: any = ClassroomSelect;
  constructor(private router: Router,private ClassroomService: ClassroomsService,) { }

  ngOnInit(): void {

    this.getClassrooms();
  }

  public  getClassrooms(): void {
    this.styleTable.dataSource = [];
    this.ClassroomService.getClassroomsByRolesAllow().subscribe((res: any) => {
      if (!res.error) {
        this.Classrooms = res.data;
        this.Classrooms.forEach((Classroom: any) => {
          const newClassroom = {
            id: Classroom.id,
            value1: Classroom.identification_number,
            value2: Classroom.last_name,
            value3: Classroom.email_notifications,
            value4: Classroom.status === 0 ? 'Desbloqueado' : 'Bloqueado',
            value5: Classroom.roles ? Classroom.roles[0].name : '',
          }
          this.styleTable.dataSource?.push(newClassroom);
        })
      }
    });
  }

  public eventTableOption(data:any): void {
    if (data.type === 'edit') {
      this.router.navigate(['/admin/Classroom/detail'])
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
