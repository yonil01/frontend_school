import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  public formPassword: FormGroup;
  constructor(private _formBuilder: FormBuilder,) {

    this.formPassword = this._formBuilder.group({
      password: [''],
      password_comfirm: [''],
    });
  }

  ngOnInit(): void {
  }

  public saveForm():void {

  }
}
