import {Component, OnInit, HostBinding, Input, Output, EventEmitter} from '@angular/core';
// import { MenuService } from '@app/core/ui/services/menu.service';
import {LocalStorageService} from '@app/core/services/local-storage/local-storage.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/internal/Subscription';
import {EnvServiceProvider} from '@app/core/services/env/env.service.provider';
// import {LogoutService} from "@app/core/services/graphql/auth/logout/logout.service";
import {AppState} from "@app/core/store/app.reducers";
import {Store} from "@ngrx/store";
import {controlLogin} from "@app/core/store/actions/token.action";
import {decryptText} from "@app/core/utils/crypto/cypher";
import {animate, animation, style, transition, trigger, useAnimation} from "@angular/animations";
import {MenuService} from "@app/ui/services/menu.service";
import {AdminElement} from "@app/core/utils/constants/constant";

const showAnimation = animation([
  style({transform: '{{transform}}'}),
  animate('{{transition}}')
]);

const hideAnimation = animation([
  animate('{{transition}}', style({transform: '{{transform}}'}))
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
  private items: any;
  public showConfirmLogout: boolean = false;
  public activeAcordion1: boolean = false
  public activeAcordion2: boolean = false
  public transformOptions: string = "translate3d(-100%, 0px, 0px)";
  public transitionOptions: string = '0.2s cubic-bezier(0, 0, 0.2, 1)';
  public url_logo: string = '';
  public UserNames: string = '';
  public isBlock: boolean = false;

  public isOptionConfig: boolean = false;
  private modulesUserLogin: any[] = [];
  public adminList: any[] = [];

  constructor(
    private _menuService: MenuService,
    private _localStorageService: LocalStorageService,
    // private _loguotService: LogoutService,
    private _sessionsService: LocalStorageService,
    private store: Store<AppState>,
    private route: Router,
  ) {

    this.modulesUserLogin = _sessionsService.getModules();

    for(let module of this.modulesUserLogin){
      if(module.id === "667c1c37-0d72-4ecc-945e-93ab97b4b0cc"){ //Administration
        for(let component of module.components){
          component.elements.forEach((element:any) => {
            const adminItem = AdminElement.find((item) => item.id === element.id);
            if(adminItem){
              this.adminList.push(adminItem);
            }
          });
        }
      }
      if(module.id === "b53819ee-2088-4e8a-be68-2e4b1d82cebb"){ //Monitoreo
        for(let component of module.components){
          component.elements.forEach((element:any) => {
            const adminItem = AdminElement.find((item) => item.id === element.id);
            if(adminItem){
              this.adminList.push(adminItem);
            }
          });
        }
      }
    }

  }

  ngOnInit(): void {
    this.getModules();
    this.getUrlLogo();
    this.UserNames = this._localStorageService.getUserName();
  }

  private getModules() {
    const data = this._localStorageService.getModules();
    this.items = data.map((element: any) => {
      return {
        label: element.name,
        active: false,
        class: element.class,
        items: element.components?.map((component: any) => {
          return {
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

  public confirmDialogLogout(event: boolean): void {
    const confirm = event;
    this.isBlock = true;
    this.showConfirmLogout = false;
    if(confirm){
      this.logout();
    }else{
      this.isBlock = false;
    }
  }

  public async logout() {
    // this._loguotService.logout();
    this._localStorageService.removeSession();
    this.store.dispatch(controlLogin({logged: false}));
    await this.route.navigateByUrl('');
    if (EnvServiceProvider.useFactory().REDIRECT_TO) {
      window.location.href = decryptText(EnvServiceProvider.useFactory().REDIRECT_URL, '');
    }
  }
}
