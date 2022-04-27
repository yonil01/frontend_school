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
import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {EnvServiceProvider} from "@app/core/services/env/env.service.provider";
import {decryptText} from "@app/core/utils/crypto/cypher";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  private _subscription = new Subscription();

  //  Logout
  timed :boolean = false;
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = new Date();
  countdown:any;

  constructor(
    private router: Router,
    private _authenticationGuard: AuthenticationGuard,
    private store: Store<AppState>,
    _modalService: ModalService,
    localStorageService: LocalStorageService,
    lookAndFeelService: LookAndFeelService,
    private _cryptoService: CryptoService,
    private idle: Idle,
    private _localStorageService: LocalStorageService,
    private route: Router,
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


    // sets an idle timeout of 5 seconds, for testing purposes.
    idle.setIdle(5);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(1200);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
    });

    idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
    idle.onTimeoutWarning.subscribe((countdown: any) => {

      this.idleState = 'Tiempo en desuso de app ' + countdown + ' segundos!';
      // console.log(countdown)
      if(countdown == 1){
        this.logout();
        this.timed = true;
        console.log("Ya se cerró session");
      }
    });
    this.reset();
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

  public reset() {
    this.idle.watch();
    this.idleState = 'Login in uso.';
    this.timedOut = false;
  }

  public async logout() {
    this._localStorageService.removeSession();
    this.store.dispatch(controlLogin({logged: false}));
    await this.route.navigateByUrl('');
    if (EnvServiceProvider.useFactory().REDIRECT_TO) {
      window.location.href = decryptText(EnvServiceProvider.useFactory().REDIRECT_URL, '');
    }
  }
}
