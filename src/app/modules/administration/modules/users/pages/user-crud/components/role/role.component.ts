import { Component, OnInit } from '@angular/core';
import {StepModel} from "@app/ui/components/step/models/step-vertical-model";
import {CrudModel} from "@app/modules/administration/modules/users/models/user-crud-model/user-crud-constans";

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  public styleStep: StepModel = CrudModel;
  constructor() { }
  list1: any[] = [];

  list2: any[] = [];

  ngOnInit(): void {
  }

  public nextStep(index: number) {

    this.styleStep.dataSourceStep.forEach((item: any, i:number) => {
      if (index === i) {
        item.status = 'Completed'
      }
      if ((index + 1) === i) {
        item.status = 'Active'
      }
    })

  }
  public backStep(index: number) {
    this.styleStep.dataSourceStep.forEach((item: any, i:number) => {
      if (index === i) {
        item.status = 'Completed'
      }
      if ((index - 1) === i) {
        item.status = 'Active'
      }
    })
  }

}
