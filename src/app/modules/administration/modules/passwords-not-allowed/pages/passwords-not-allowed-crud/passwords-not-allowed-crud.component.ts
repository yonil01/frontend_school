import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs/internal/Subscription";
import {
  PasswordNotAllowedService
} from "@app/modules/administration/modules/passwords-not-allowed/services/password-not-allowed.service";

@Component({
  selector: 'app-passwords-not-allowed-crud',
  templateUrl: './passwords-not-allowed-crud.component.html',
  styleUrls: ['./passwords-not-allowed-crud.component.scss']
})
export class PasswordsNotAllowedCrudComponent implements OnInit {
  private subscription: Subscription = new Subscription();

  constructor(
    private passwordNotAllowedService: PasswordNotAllowedService
  ) {
    this.subscription.add(
      this.passwordNotAllowedService.CreateBlackListPwd("yu12345678").subscribe(
        {
          next: (res) => {
            if (res.error) {

            } else {
           console.log(res)
            }

          },
          error: (err: Error) => {
            console.error(err.message)
          }

        }
      ));
  }

  ngOnInit(): void {
  }

}
