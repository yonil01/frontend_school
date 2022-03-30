import {Component, Input, OnInit} from '@angular/core';
import {User} from "@app/core/models";
import {
  CrudModel,
  userSelect
} from "@app/modules/administration/modules/users/models/user-crud-model/user-crud-constans";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StepModel} from "@app/ui/components/step/models/step-vertical-model";

@Component({
  selector: 'app-basic-information',
  templateUrl: './basic-information.component.html',
  styleUrls: ['./basic-information.component.scss']
})
export class BasicInformationComponent implements OnInit {
  @Input() user: User;
  public formBasicInfo: FormGroup;
  public styleStep: StepModel = CrudModel;
  constructor( private _formBuilder: FormBuilder,) {
    this.user = {
      id: '',
      username: '',
      name: '',
      last_name: '',
      email_notifications: '',
      identification_number: '',
      identification_type: '',
      status: 0,
      roles: [
        {
          id: '',
          name: '',
          role_allow: {}
        }
      ],
      security_entities: [],
      created_at: ''
    }


    this.formBasicInfo = this._formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9_]+$')]],
      name: ['', [Validators.required, Validators.maxLength(255), Validators.pattern('[a-zA-Z ]{2,255}')]],
      last_name: ['', [Validators.required, Validators.maxLength(255), Validators.pattern('[a-zA-Z ]{2,255}')]],
      email_notifications: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/),
        Validators.email, Validators.minLength(5), Validators.maxLength(255)],
      ],
      identification_type: ['', Validators.required],
      identification_number: ['', [Validators.required, Validators.maxLength(255)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(10)],],
      password_comfirm: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(10)]],
    });


  }

  ngOnInit(): void {
    this.loadUser();
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

  public loadUser():void {
    this.formBasicInfo.get('username')!.setValue(this.user.username);
    this.formBasicInfo.get('name')!.setValue(this.user.name);
    this.formBasicInfo.get('last_name')!.setValue(this.user.last_name);
    this.formBasicInfo.get('email_notifications')!.setValue(this.user.email_notifications);
    this.formBasicInfo.get('identification_number')!.setValue(this.user.identification_number);
    this.formBasicInfo.get('identification_type')!.setValue(this.user.identification_type);

  }

}
