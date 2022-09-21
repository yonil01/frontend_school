import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  CrudModel,
  ClassroomSelect
} from "@app/modules/administration/modules/classroom/models/classroom-crud-model/classroom-crud-constans";
import {StepModel} from "@app/ui/components/step/models/step-vertical-model";
import {Router} from "@angular/router";
import {Classroom} from "@app/core/models";

@Component({
  selector: 'app-subject-crud',
  templateUrl: './classroom-crud.component.html',
  styleUrls: ['./classroom-crud.component.scss']
})
export class ClassroomCrudComponent implements OnInit {
  public styleCrud: StepModel = CrudModel;
  @Input() Classroom: Classroom;
  @Input() isEdit: boolean;
  @Output() showToast = new EventEmitter<any>();

  constructor(private router: Router) {
    this.Classroom = {};
    this.isEdit = false;
  }

  ngOnInit(): void {
    if (Object.keys(this.Classroom).length) {
      this.showDisabledStep(this.Classroom);
    }
  }

  public valueClassroom(Classroom: Classroom): void {
    this.Classroom = Classroom;
  }

  public showToastAdd(data: any): any {
    this.showToast.emit(data);
  }

  public showDisabledStep(Classroom: Classroom): void {
    this.styleCrud.dataSourceStep.forEach((item: any, i: number) => {
      if (i === (this.styleCrud.dataSourceStep.length - 1)) {
        if (Classroom.dni !== null) {
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
