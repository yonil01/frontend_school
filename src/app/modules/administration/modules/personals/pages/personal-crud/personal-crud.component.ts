import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  CrudModel,
  PersonalSelect
} from "@app/modules/administration/modules/personals/models/personal-crud-model/personal-crud-constans";
import {StepModel} from "@app/ui/components/step/models/step-vertical-model";
import {Router} from "@angular/router";
import {Personal} from "@app/core/models";

@Component({
  selector: 'app-subject-crud',
  templateUrl: './personal-crud.component.html',
  styleUrls: ['./personal-crud.component.scss']
})
export class PersonalCrudComponent implements OnInit {
  public styleCrud: StepModel = CrudModel;
  @Input() Personal: Personal;
  @Input() isEdit: boolean;
  @Output() showToast = new EventEmitter<any>();

  constructor(private router: Router) {
    this.Personal = {};
    this.isEdit = false;
  }

  ngOnInit(): void {
    if (Object.keys(this.Personal).length) {
      this.showDisabledStep(this.Personal);
    }
  }

  public valuePersonal(Personal: Personal): void {
    this.Personal = Personal;
  }

  public showToastAdd(data: any): any {
    this.showToast.emit(data);
  }

  public showDisabledStep(Personal: Personal): void {
    this.styleCrud.dataSourceStep.forEach((item: any, i: number) => {
      if (i === (this.styleCrud.dataSourceStep.length - 1)) {
        if (Personal.dni !== null) {
          item.status = 'Completed';
          item.block = false;
        }
      } else {
        item.status = 'Completed';
        item.block = false;
      }
    })
  }

}
