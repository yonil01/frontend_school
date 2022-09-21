import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import { MenuService } from '@app/core/ui/services/menu.service';
import { LocalStorageService } from '@app/core/services/local-storage/local-storage.service';
import { Router } from '@angular/router';
import { EnvServiceProvider } from '@app/core/services/env/env.service.provider';
import {LogoutService} from "@app/core/services/graphql/auth/logout/logout.service";
import {AppState} from "@app/core/store/app.reducers";
import {Store} from "@ngrx/store";
import {controlLogin} from "@app/core/store/actions/token.action";
import {decryptText} from "@app/core/utils/crypto/cypher";
import {animate, animation, style, transition, trigger, useAnimation} from "@angular/animations";
import {ConfirmDialogService} from "@app/core/ui/confirm-dialog/confirm-dialog.service";

const showAnimation = animation([
  style({transform: '{{transform}}'}),
  animate('{{transition}}')
]);

const hideAnimation = animation([
  animate('{{transition}}', style({ transform: '{{transform}}'}))
]);

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [
    trigger('overlayState', [
        transition('void => visible', [
          useAnimation(showAnimation),
        ]),
        transition('visible => void', [
          useAnimation(hideAnimation)
        ])
      ]
    ),
  ]
})
export class MenuComponent implements OnInit {
  @Output('close-menu') closeMenu = new EventEmitter<boolean>();
  public items: any;
  public activeAcordion1: boolean = false
  public activeAcordion2: boolean = false
  public transformOptions: string = "translate3d(-100%, 0px, 0px)";
  public transitionOptions: string = '0.2s cubic-bezier(0, 0, 0.2, 1)';
  public url_logo: string = '';
  public UserNames: string = '';

  public ecatch_api = EnvServiceProvider.useFactory().ECATCH_API;

  constructor(
    private _menuService: MenuService,
    private _localStorageService: LocalStorageService,
    private _logOutService: LogoutService,
    private store: Store<AppState>,
    private route: Router,
    private _confirmDialog: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.getModules();
    this.getUrlLogo();
    this.UserNames = this._localStorageService.getUserName();
  }

  private async getModules() {
    const data = await this._localStorageService.getModules();
    this.items = data.map((element: any) => {
      return {
        id: element.id,
        label: element.name,
        active: false,
        class: element.class,
        items: element.components?.map((component: any) => {
          return {
            id: component.id,
            label: component.name,
            icon: component.class,
            routerLink: [component.url_front],
          };
        }),
      };
    });
  }

  private getUrlLogo(): void {
    this.url_logo = EnvServiceProvider.useFactory().MENU_URL_LOGO;
  }

  public logout(): void {
    this._confirmDialog.confirm({
      message: ``,
      header: '¿Está seguro(a) de cerrar la sesión?',
      type: 'info',
      position: 'top',
      key: 'logout-menu',
      accept: () => {
        this._logOutService.logout();
        this._localStorageService.removeSession();
        this.store.dispatch(controlLogin({ logged: false }));
        this.route.navigateByUrl('');
        if (EnvServiceProvider.useFactory().REDIRECT_TO) {
          // @ts-ignore
          window.location.href = decryptText(EnvServiceProvider.useFactory().REDIRECT_URL);
        }
      },
      reject: () => {
      }
    });
  }
}
