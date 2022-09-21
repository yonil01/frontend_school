import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {controlLogin} from "@app/core/store/actions/token.action";
import {EnvServiceProvider} from "@app/core/services/env/env.service.provider";
import {decryptText, encryptText} from "@app/core/utils/crypto/cypher";
import {LogoutService} from "@app/core/services/graphql/auth/logout/logout.service";
import {LocalStorageService} from "@app/core/services/local-storage/local-storage.service";
import {Store} from "@ngrx/store";
import {AppState} from "@app/core/store/app.reducers";
import {Router} from "@angular/router";
import {ConfirmDialogService} from "@app/core/ui/confirm-dialog/confirm-dialog.service";
import {setLanguage} from "@app/core/store/actions/language.action";
import {LanguageState} from "@app/core/store/reducers";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastService} from "ecapture-ng-ui";
import {Subscription} from "rxjs/internal/Subscription";
import {UserService} from "@app/core/services/graphql/user/user.service";
import {HttpErrorResponse} from "@angular/common/http";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/modules/login/data/style/data.style";
import {RoleService} from "@app/core/services/graphql/auth/role/role.service";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  public activeSidebar: boolean = false;
  private _subscription: Subscription = new Subscription();
  @Input() styleSidebar: string = '';
  @Input('breadcrumb') breadcrumb: string[] = [];
  @Input('enable-item') itemsEnabled: string[] = [];
  @Output('event-header') eventHeader: EventEmitter<string> = new EventEmitter();
  public typeRecharge: string = 'manual';

  public isConfigSystem: boolean = false;
  public isChangePassword: boolean = false;
  public userName: string = '';
  public email: string = '';
  public userId: string = '';
  public dateNow: string = new Date().toLocaleDateString();
  public language: string = 'es';
  public formPassword: FormGroup;
  public isBlock: boolean = false;
  public toastStyle: ToastStyleModel = toastDataStyle;
  public rolesUser: any[] = [];
  public secretKey: string = '';

  constructor(
    private _logOutService: LogoutService,
    private _localStorageService: LocalStorageService,
    private store: Store<AppState>,
    private route: Router,
    private _confirmDialog: ConfirmDialogService,
    private _messageService: ToastService,
    private usersService: UserService,
    private rolesService: RoleService,
  ) {
    this.store.select('env').subscribe(
      (res) => {
        this.secretKey = res.env;
      },
    );


    // this.userName = this._localStorageService.getUserName();
    this.email = this._localStorageService.getUserEmail();
    this.language = this._localStorageService.getLanguage();
    this.userId = this._localStorageService.getUserId();
    this.formPassword = new FormGroup({
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
    });
   /* this._subscription.add(
      this.usersService.getUserByID(this.userId).subscribe((res) => {
        if (!res.error) {
          const user = res.data;

          this._subscription.add(
            this.rolesService.getRoles().subscribe((res) => {
              if(!res.error){
                const roles = res.data;

                for (let role of roles){
                  for(let roleUser of user.roles){
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
    );*/
  }

  ngOnInit(): void {
  }

  public changeStatusSidebar() {
    this.activeSidebar = !this.activeSidebar;
  }

  public logOut(): void {
    this._confirmDialog.confirm({
      message: ``,
      header: '¿Está seguro(a) de cerrar la sesión?',
      type: 'info',
      position: 'top',
      key: 'logout',
      accept: () => {
        this._logOutService.logout();
        this._localStorageService.removeSession();
        this.store.dispatch(controlLogin({logged: false}));
        this.route.navigateByUrl('');
        if (EnvServiceProvider.useFactory().REDIRECT_TO) {
          //window.location.href = decryptText(EnvServiceProvider.useFactory().REDIRECT_URL);
        }
      },
      reject: () => {
      }
    })
  }

  public changeTypeRecharge(): void {
    this.typeRecharge = this.typeRecharge === 'manual' ? 'automatic' : 'manual';
    if (this.typeRecharge === 'automatic') {
      this.itemsEnabled = this.itemsEnabled.filter(item => item !== 'get-work');
    } else {
      this.itemsEnabled.push('get-work');
      this.isEnableItem('get-work');
    }
    this.eventHeader.emit(this.typeRecharge);
  }

  public isEnableItem(item: string): boolean {
    return this.itemsEnabled.includes(item);
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

  public changePassword(): void {
    if (this.formPassword.valid) {
      console.log(this.secretKey);
      const pass: string = encryptText(this.formPassword.get('newPassword')?.value, '');
      const passConfirm: string = encryptText(this.formPassword.get('confirmPassword')?.value, '');
      const passOld: string = encryptText(this.formPassword.get('currentPassword')?.value, '');
      this.isBlock = true;
      this._subscription.add(
        this.usersService.changePassUser(this.userId, pass, passConfirm, passOld).subscribe({
          next: (response) => {
            if (response.error) {
              this._messageService.add({type: 'error', message: response.msg, life: 5000});
            } else {
              this._messageService.add({type: 'success', message: response.msg, life: 5000});
              this.isConfigSystem = false;
              this.isChangePassword = false;
              this.formPassword.reset()
            }
            this.isBlock = false;
          },
          error: (err: HttpErrorResponse) => {
            console.error(err);
            this._messageService.add({type: 'error', message: 'Ocurrió un error al cambiar la contraseña', life: 5000});
            this.isBlock = false;
          }
        })
      );
    } else {
      this.formPassword.markAllAsTouched();
      this._messageService.add({type: 'error', message: 'Por favor, ingrese todos los campos requeridos.', life: 5000});
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

}
