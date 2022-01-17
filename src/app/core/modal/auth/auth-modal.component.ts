import { OnInit, Component, OnDestroy } from '@angular/core';
import { ModalService } from '@app/core/services/modal/modal.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '@app/core/services/authentication/authentication.service';
import { EnvService } from '@app/core/services/env/env.service';
import { AppState } from '@app/core/store/app.reducers';
import { Store } from '@ngrx/store';
import { controlLogin } from '@app/core/store/actions/token.action';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss'],
  providers: [AuthenticationService, EnvService],
})
export class AuthModalComponent implements OnInit, OnDestroy {
  public isOpen = false;
  public subscription: Subscription;
  public form: FormGroup;
  public loginError = false;
  public isLoading = false;

  constructor(
    private modalService: ModalService,
    private _formBuilder: FormBuilder,
    private _authenticationService: AuthenticationService,
    private store: Store<AppState>,
  ) {

    this.subscription = this.modalService.getModal().subscribe((isOpen) => {
      this.isOpen = isOpen;
    });

    this.form = this._formBuilder.group({
      id: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      // recaptcha: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loginError = false;
  }

  login() {
    this.loginError = false;
    this.isLoading = true;
    this._authenticationService.login(this.form.value, '').subscribe((resp: any) => {
      if (resp.data) {
        this._authenticationService.setTokenSessionStorage(resp.data);
        this.store.dispatch(controlLogin({ logged: true }));
        this.modalService.close();
      } else {
        this.loginError = true;
      }
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
