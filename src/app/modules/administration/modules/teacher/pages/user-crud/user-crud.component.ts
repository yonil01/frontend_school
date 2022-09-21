import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  CrudModel,
  Teacherelect
} from "@app/modules/administration/modules/teacher/models/teacher-crud-model/teacher-crud-constans";
import {StepModel} from "@app/ui/components/step/models/step-vertical-model";
import {Router} from "@angular/router";
import {User} from "@app/core/models";

@Component({
  selector: 'app-subject-crud',
  templateUrl: './user-crud.component.html',
  styleUrls: ['./user-crud.component.scss']
})
export class UserCrudComponent implements OnInit {
  public styleCrud: StepModel = CrudModel;
  @Input() user: User;
  @Input() isEdit: boolean;
  @Output() showToast = new EventEmitter<any>();

  constructor(private router: Router) {
    this.user = {};
    this.isEdit = false;
  }

  ngOnInit(): void {
    if (Object.keys(this.user).length) {
      this.showDisabledStep(this.user);
    }
  }

  public valueUser(user: User): void {
    this.user = user;
  }

  public showToastAdd(data: any): any {
    this.showToast.emit(data);
  }

  public showDisabledStep(user: User): void {
    this.styleCrud.dataSourceStep.forEach((item: any, i: number) => {
      if (i === (this.styleCrud.dataSourceStep.length - 1)) {
        if (user.dni !== null) {
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
