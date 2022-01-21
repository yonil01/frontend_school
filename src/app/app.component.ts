import {Component, OnDestroy} from '@angular/core';
import {Router, Event, NavigationStart} from '@angular/router';
import {Store} from '@ngrx/store';
import {ModalService} from '@app/core/services/modal/modal.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {AppState} from "@app/core/store/app.reducers";
import {setEnv} from "@app/core/store/actions/env.actions";
import {CryptoService} from "@app/core/services/crypto/crypto.service";
import {controlLogin, controlTimeout} from "@app/core/store/actions/token.action";
import {LocalStorageService} from "@app/core/services/local-storage/local-storage.service";
import {LookAndFeelService} from "@app/core/services/look-and-feel/look-and-feel.service";
import {AuthenticationGuard} from "@app/core/services/guards/authentication.guard";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  private _subscription = new Subscription();

  constructor(
    private router: Router,
    private _authenticationGuard: AuthenticationGuard,
    private store: Store<AppState>,
    _modalService: ModalService,
    localStorageService: LocalStorageService,
    lookAndFeelService: LookAndFeelService,
    private _cryptoService: CryptoService,
  ) {
    this.setTheme();
    this.getAppId();
    lookAndFeelService.getLookAndFeelConfig().subscribe((resp) => {
      sessionStorage.setItem('look-and-feel-config', JSON.stringify(resp));
    });
    let current: any;
    let timeout: any;

    if (sessionStorage.getItem('Token')) {
      timeout = localStorageService.getSessionExp();
      store.dispatch(controlTimeout({timeout: timeout}));
    }
    store.select('token').subscribe((state) => {
      timeout = state.timeout;
    });

    setInterval(() => {
      current = new Date().getTime() / 1000;
      if (timeout && current > timeout - 5) {
        if (router.url !== '/') {
          timeout = null;
          _modalService.open();
        }
      }
    }, 1000);

    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        if (!event.url.includes('docpop')) {
          if (sessionStorage.getItem('Token')) {
            store.dispatch(controlLogin({logged: true}));
            this._authenticationGuard.validateSessionExp();
          }
        } else {
          if (sessionStorage.getItem('Token')) {
            store.dispatch(controlLogin({logged: true}));
          } else {
            store.dispatch(controlLogin({logged: false}));
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  private getAppId(): void {
    this._subscription.add(
      this._cryptoService.getAppId().subscribe(
        (res) => {
          this.store.dispatch(setEnv({env: window.atob(res.secret_key)}));
        },
        (res: Error) => {
          console.error(res.message);
        },
      ),
    );
  }

  private setTheme() {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      const body = document.querySelector('#body')
      if (body) body.classList.add('dark:theme-dark')
    }
  }
}
