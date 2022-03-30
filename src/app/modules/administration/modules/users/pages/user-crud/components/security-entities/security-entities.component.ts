import { Component, OnInit } from '@angular/core';
import {DropdownModel} from "ecapture-ng-ui/lib/modules/dropdown/models/dropdown";
import {
  acTypeIdentification
} from "@app/modules/wizard/dynamic-forms/models/model-container-cad/constans-container-card";
import {TableModel} from "@app/ui/components/table/model/table.model";
import {
  styleTableEntitySegurity
} from "@app/modules/administration/modules/users/models/model-segurity-entities/constans-segurity-entities";
import {StepModel} from "@app/ui/components/step/models/step-vertical-model";
import {CrudModel} from "@app/modules/administration/modules/users/models/user-crud-model/user-crud-constans";

@Component({
  selector: 'app-security-entities',
  templateUrl: './security-entities.component.html',
  styleUrls: ['./security-entities.component.scss']
})
export class SecurityEntitiesComponent implements OnInit {
  public typeIdentificationStyle: DropdownModel = acTypeIdentification;
  public styleTable: TableModel = styleTableEntitySegurity;
  public styleStep: StepModel = CrudModel;
  constructor() { }

  ngOnInit(): void {
  }

  public eventTableOption(data:any): void {
    if (data.type === 'normally') {

    }
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
