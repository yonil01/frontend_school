import { Component, OnInit } from '@angular/core';
import {TableModel} from "@app/ui/components/table/model/table.model";
import {styleTableFirst} from "@app/modules/wizard/dynamic-forms/models/constans";
import {Router} from "@angular/router";
import {Subject, User} from "@app/core/models";
import {styleTableSubject} from "@app/modules/administration/modules/subject/models/model-subject/constans-subject";
import {SubjectsService} from "@app/modules/administration/modules/subject/service/subject/subject.service";
import {
  SubjectSelect
} from "@app/modules/administration/modules/subject/models/subject-crud-model/subject-crud-constans";

@Component({
  selector: 'app-teacher-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.scss']
})
export class SubjectListComponent implements OnInit {
  public styleTable: TableModel = styleTableSubject;
  public Subjects: Subject[] = [];
  public SubjectSelect: any = SubjectSelect;
  constructor(private router: Router,private SubjectService: SubjectsService,) { }

  ngOnInit(): void {

    this.getSubjects();
  }

  public  getSubjects(): void {
    this.styleTable.dataSource = [];
    this.SubjectService.getSubjectsByRolesAllow().subscribe((res: any) => {
      if (!res.error) {
        this.Subjects = res.data;
        this.Subjects.forEach((Subject: any) => {
          const newSubject = {
            id: Subject.id,
            value1: Subject.identification_number,
            value2: Subject.last_name,
            value3: Subject.email_notifications,
            value4: Subject.status === 0 ? 'Desbloqueado' : 'Bloqueado',
            value5: Subject.roles ? Subject.roles[0].name : '',
          }
          this.styleTable.dataSource?.push(newSubject);
        })
      }
    });
  }

  public eventTableOption(data:any): void {
    if (data.type === 'edit') {
      this.router.navigate(['/admin/Subject/detail'])
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
