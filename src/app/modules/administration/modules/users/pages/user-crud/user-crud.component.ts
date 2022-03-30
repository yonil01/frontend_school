import { Component, OnInit } from '@angular/core';
import {
  CrudModel,
  userSelect
} from "@app/modules/administration/modules/users/models/user-crud-model/user-crud-constans";
import {StepModel} from "@app/ui/components/step/models/step-vertical-model";

@Component({
  selector: 'app-user-crud',
  templateUrl: './user-crud.component.html',
  styleUrls: ['./user-crud.component.scss']
})
export class UserCrudComponent implements OnInit {
  public styleCrud: StepModel = CrudModel;
  public userSelect: any = userSelect;

  constructor() { }

  ngOnInit(): void {
    console.log(userSelect)
    debugger
  }

}
