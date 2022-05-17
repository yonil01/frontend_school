import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Store} from "@ngrx/store";
import {AppState} from "@app/core/store/app.reducers";
import {UsersService} from "@app/modules/administration/services/user/users.service";
import {RoleService} from "@app/core/services/graphql/auth/role/role.service";
import {LocalStorageService} from "@app/core/services/local-storage/local-storage.service";
import {Subscription} from "rxjs/internal/Subscription";
import {ToastService} from "ecapture-ng-ui";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {LanguageState} from "@app/core/store/reducers";
import {setLanguage} from "@app/core/store/actions/language.action";
import {EnvServiceProvider} from "@app/core/services/env/env.service.provider";
import {controlLogin} from "@app/core/store/actions/token.action";
import {ConfirmDialogService} from "@app/ui/components/confirm-dialog/confirm-dialog.service";
import {decryptText} from "@app/core/utils/crypto/cypher";
import {Router} from "@angular/router";
import {LogoutService} from "@app/core/services/graphql/auth/logout/logout.service";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  public openMenu = true;
  public activeSidebar: boolean = false;
  @Input() typeButton: number;
  @Input() styleSidebar: string = '';
  private _subscription: Subscription = new Subscription();

  public showConfirmLogout: boolean = false;
  public isConfigSystem: boolean = false;
  public isChangePassword: boolean = false;
  public userId: string = '';
  public dateNow: string = new Date().toLocaleDateString();
  public language: string = 'es';
  public isBlock: boolean = false;
  public toastStyle: ToastStyleModel = toastDataStyle;
  public rolesUser: any[] = [];
  public secretKey: string = '';
  public user: any = {};

  constructor(
    private _logOutService: LogoutService,
    private location: Location,
    private store: Store<AppState>,
    private usersService: UsersService,
    private rolesService: RoleService,
    private _localStorageService: LocalStorageService,
    private _messageService: ToastService,
    private _confirmDialog: ConfirmDialogService,
    private route: Router,
  ) {
    this.typeButton = 0;
    this.language = this._localStorageService.getLanguage() || '';
    this.userId = this._localStorageService.getUserId() || '';

    this._subscription.add(
      this.usersService.getUserByID(this.userId).subscribe((res) => {
        if (!res.error) {
          this.user = res.data;

          this._subscription.add(
            this.rolesService.getRoles().subscribe((res) => {
              if(!res.error){
                const roles = res.data;

                for (let role of roles){
                  for(let roleUser of this.user.roles){
                    if(role.id === roleUser.id){
                      this.rolesUser.push(role.name);
                      break;
                    }
                  }
                }

                this.isBlock = false;
              }else{
                this._messageService.add({
                  type: 'warning',
                  message: 'Error de Carga: No se podrá mostrar los roles del usuario, recargar página.',
                  life: 5000,
                });
                this.isBlock = false;
              }
            })
          );
        } else {
          this._messageService.add({
            type: 'warning',
            message: 'Error de Carga: No se podrá mostrar los roles del usuario, recargar página.',
            life: 5000,
          });
          this.isBlock = false;
        }
      })
    );

    this.store.select('env').subscribe(
      (res) => {
        this.secretKey = res.env;
      },
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  public changeStatusSidebar(){
    this.activeSidebar = !this.activeSidebar;
  }

  public loadUrl() {
    window.location.reload();
  }

  public backLoad():void {
    this.location.back();
  }

  public setLanguage(language: string): void {
    this.language = language;
    this._localStorageService.setLanguage(language);
    const languageAction: LanguageState = {
      language: language,
      id: this._localStorageService.getUserId()
    };
    this.store.dispatch(setLanguage({language: languageAction}));
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

  private logout(){
    this._logOutService.logout();
    this._localStorageService.removeSession();
    this.store.dispatch(controlLogin({logged: false}));
    this.route.navigateByUrl('');
    if (EnvServiceProvider.useFactory().REDIRECT_TO) {
      window.location.href = decryptText(EnvServiceProvider.useFactory().REDIRECT_URL, this.secretKey);
    }
    this.isBlock = false;
  }
}
