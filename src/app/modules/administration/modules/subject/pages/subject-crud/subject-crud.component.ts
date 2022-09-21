import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  CrudModel,
  SubjectSelect
} from "@app/modules/administration/modules/subject/models/subject-crud-model/subject-crud-constans";
import {StepModel} from "@app/ui/components/step/models/step-vertical-model";
import {Router} from "@angular/router";
import {Subject} from "@app/core/models";

@Component({
  selector: 'app-subject-crud',
  templateUrl: './subject-crud.component.html',
  styleUrls: ['./subject-crud.component.scss']
})
export class SubjectCrudComponent implements OnInit {
  public styleCrud: StepModel = CrudModel;
  @Input() Subject: Subject;
  @Input() isEdit: boolean;
  @Output() showToast = new EventEmitter<any>();

  constructor(private router: Router) {
    this.Subject = {};
    this.isEdit = false;
  }

  ngOnInit(): void {
    if (Object.keys(this.Subject).length) {
      this.showDisabledStep(this.Subject);
    }
  }

  public valueSubject(Subject: Subject): void {
    this.Subject = Subject;
  }

  public showToastAdd(data: any): any {
    this.showToast.emit(data);
  }

  public showDisabledStep(Subject: Subject): void {
    this.styleCrud.dataSourceStep.forEach((item: any, i: number) => {
      if (i === (this.styleCrud.dataSourceStep.length - 1)) {
        if (Subject.dni !== null) {
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
