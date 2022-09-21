import { Component, OnInit } from '@angular/core';
import {TableModel} from "@app/ui/components/table/model/table.model";
import {styleTableFirst} from "@app/modules/wizard/dynamic-forms/models/constans";
import {Router} from "@angular/router";
import {styleTablePersonal} from "@app/modules/administration/modules/personals/models/model-personal/constans-personal";
import {Personal, User} from "@app/core/models";
import {PersonalSelect} from "@app/modules/administration/modules/personals/models/personal-crud-model/personal-crud-constans";
import {PersonalsService} from "@app/modules/administration/modules/personals/service/user/users.service";

@Component({
  selector: 'app-teacher-list',
  templateUrl: './personal-list.component.html',
  styleUrls: ['./personal-list.component.scss']
})
export class PersonalListComponent implements OnInit {
  public styleTable: TableModel = styleTablePersonal;
  public Personals: Personal[] = [];
  public PersonalSelect: any = PersonalSelect;
  constructor(private router: Router,private PersonalService: PersonalsService,) { }

  ngOnInit(): void {

    this.getPersonals();
  }

  public  getPersonals(): void {
    this.styleTable.dataSource = [];
    this.PersonalService.getPersonalsByRolesAllow().subscribe((res) => {
      if (!res.error) {
        this.Personals = res.data;
        this.Personals.forEach((Personal: any) => {
          const newPersonal = {
            id: Personal.id,
            value1: Personal.identification_number,
            value2: Personal.last_name,
            value3: Personal.email_notifications,
            value4: Personal.status === 0 ? 'Desbloqueado' : 'Bloqueado',
            value5: Personal.roles ? Personal.roles[0].name : '',
          }
          this.styleTable.dataSource?.push(newPersonal);
        })
      }
    });
  }

  public eventTableOption(data:any): void {
    if (data.type === 'edit') {
      this.router.navigate(['/admin/Personal/detail'])
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
