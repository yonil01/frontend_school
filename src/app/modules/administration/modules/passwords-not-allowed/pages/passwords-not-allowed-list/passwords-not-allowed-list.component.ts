import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  PasswordNotAllowedService
} from "@app/modules/administration/modules/passwords-not-allowed/services/password-not-allowed.service";
import {Subscription} from "rxjs/internal/Subscription";

@Component({
  selector: 'app-passwords-not-allowed-list',
  templateUrl: './passwords-not-allowed-list.component.html',
  styleUrls: ['./passwords-not-allowed-list.component.scss']
})
export class PasswordsNotAllowedListComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  constructor(
    private passwordNotAllowedService: PasswordNotAllowedService
  ) {
    this.subscription.add(
      this.passwordNotAllowedService.getPwdNotAllowed().subscribe(
        {
          next: (res) => {
            if (res.error) {

            } else {

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

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

}
