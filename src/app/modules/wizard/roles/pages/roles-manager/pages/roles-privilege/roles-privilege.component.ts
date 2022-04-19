import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "@app/core/store/app.reducers";
import {Router} from "@angular/router";
import {Elements, Response, Role} from "@app/core/models";
import {EntityService} from "@app/modules/wizard/services/entity/entity.service";
import {RoleService} from "@app/modules/wizard/services/roles/role.service";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {ToastService} from "ecapture-ng-ui";
import {v4 as uuidv4} from 'uuid';
import {addElement, controlRole, deleteRoleElement} from "@app/core/store/actions/roles.action";
import {Subscription} from "rxjs/internal/Subscription";
import {HttpErrorResponse} from "@angular/common/http";
import {Elemento, ModulesPrivileges, Modulo, Privileges, ReduxElement} from "@app/modules/wizard/roles/models/models";

interface ComponentTemp {
  id: string,
  name: string,
  elements: ElementTemp[]
}

interface ElementTemp {
  element_id: string,
  name: string,
  active: boolean,
}


@Component({
  selector: 'app-roles-privilege',
  templateUrl: './roles-privilege.component.html',
  styleUrls: ['./roles-privilege.component.scss']
})
export class RolesPrivilegeComponent implements OnInit, OnDestroy {

  public readonly toastStyle: ToastStyleModel = toastDataStyle;
  private _subscription: Subscription = new Subscription();
  public isBlockPage: boolean = false;

  public role: Role = {};
  public modulesPrivileges: ModulesPrivileges[] = [];

  public moduloElement: Modulo[] = [];
  private dataElemenRedux: ReduxElement = {
    element: {
      id: '',
      name: '',
      description: '',
      url_back: '',
      component_id: '',
      checked: 0
    }, id: ""
  };
  private dataRolesElement: Elemento = {checked: 0, component_id: "", description: "", id: "", name: "", url_back: ""};

  public moduloSelected: ModulesPrivileges = {id: "", name: "", privileges: []};
  public moduleNameSelect: string = 'Configuracion';
  public moduleIdSelect: string = '';
  public moduleSelectedTemp: ComponentTemp[] = [];

  constructor(
    private _roleService: RoleService,
    private entityService: EntityService,
    private store: Store<AppState>,
    private router: Router,
    private _messageService: ToastService,
  ) {
    this.store.select('role').subscribe((res) => {
      const data = res.role;
      this.role = JSON.parse(JSON.stringify(data));
      if (!this.role || Object.keys(this.role).length === 0) {
        this.router.navigateByUrl('wizard/roles')
      }else{
        if(this.role.role_elements === null) this.role.role_elements = [];
      }
    });
  }

  ngOnInit(): void {
    this.initRoles();
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  private initRoles(moduleInit: string = 'Configuracion'): void {
    this.isBlockPage = true;
    this._subscription.add(
      this._roleService.getModules().subscribe({
        next: (res) => {
          if (res.error) {
            this._messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            this.modulesPrivileges = [];
            for (const item of res.data) {
              const privileges: Privileges[] = [];
              if (item.components) {
                item.components.map((component: any) => component.elements.map((element: any) => {
                  const findElement = this.role.role_elements?.find(r => r.element.id === element.id);
                  if (findElement) {
                    privileges.push({element: element, active: true});
                  } else {
                    privileges.push({element: element, active: false});
                  }
                }));

                this.modulesPrivileges.push({
                  name: item.name,
                  id: item.id,
                  privileges: privileges
                });
              }
            }

            this.moduloElement = [];
            const moduleData: Modulo[] = res.data;
            for(let item of moduleData){
              if(item.components?.length > 0){
                this.moduloElement.push(item);
              }
            }

            this.moduleSelectedTemp = [];
            const modulePrivilege = this.modulesPrivileges.find(p => p.id === this.moduleIdSelect)

            const module = this.moduloElement.find(m => m.name === moduleInit) || this.moduloElement[0];
            for(let component of module.components) {
              const elements: ElementTemp[] = [];
              for (let element of component.elements){
                elements.push({
                  element_id: element.id,
                  name: element.name,
                  active: modulePrivilege?.privileges.find(p => p.element.id === element.id)?.active || false,
                });
              }
              this.moduleSelectedTemp.push({
                id: component.id,
                name: component.name,
                elements: elements
              });
            }
            if(moduleInit === 'Configuracion'){
              this.showPrivileges(this.moduloElement[0]);
            }
          }
          this.isBlockPage = false;
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.isBlockPage = false;
          this._messageService.add({type: 'error', message: err.error.msg, life: 5000});
        }
      })
    );
  }

  public showPrivileges(modulo: Modulo): void {
    this.moduleNameSelect = modulo.name;
    this.moduleIdSelect = modulo.id;
    this.moduleSelectedTemp = [];
    const moduleFind = this.modulesPrivileges.find(m => m.id === modulo.id);

    if(moduleFind){
      for(let component of modulo.components) {
        const elements: ElementTemp[] = [];
        for (let element of component.elements){
          elements.push({
            element_id: element.id,
            name: element.name,
            active: moduleFind.privileges.find(p => p.element.id === element.id)?.active || false,
          });
        }
        this.moduleSelectedTemp.push({
          id: component.id,
          name: component.name,
          elements: elements
        });
      }
    }
  }

  public changeCheck(event: any, elementSelected: ElementTemp): void {
    if (event) {
      const dataElemento: Elements = {
        id: uuidv4().toLowerCase(),
        element_id: elementSelected.element_id.toLocaleLowerCase(),
        role_id: this.role.id?.toLocaleLowerCase(),
      };
      const dataE = JSON.parse(JSON.stringify(dataElemento));
      //this.dataElemenRedux = {id: dataE.id, element: {...data}};
      this.isBlockPage = true;
      this._subscription.add(
        this._roleService.createRolesElement(dataE).subscribe({
          next: (res) => {
            if (res.error) {
              this._messageService.add({type: 'error', message: 'Error en la Asignación' + res.msg, life: 5000});
              this.isBlockPage = false;
            } else {
              const elemnt: any = {
                id: elementSelected.element_id,
                name: elementSelected.name,
              };
              this.role.role_elements?.push({
                id: dataElemento.id,
                element: elemnt
              });
              this.store.dispatch(controlRole({ role: this.role, index: 0 }));
              this._messageService.add({type: 'success', message: 'Asignación Exitosa' + res.msg, life: 5000});
              this.initRoles(this.moduleNameSelect);
              //this.reloadRolElement();
              //this.store.dispatch(addElement({element: this.dataElemenRedux}));
            }
          },
          error: (err: HttpErrorResponse) => {
            console.error(err);
            this.isBlockPage = false;
            this._messageService.add({type: 'error', message: err.error.msg, life: 5000});
          }
        })
      );
    } else {
      const id = elementSelected.element_id;
      const element = this.role.role_elements?.find((el: { element: { id: string; }; }) => el.element?.id === id);
      const idElement = element.id.toLocaleLowerCase();
      //const indexElement = this.role.role_elements?.findIndex((el) => el.id === element.id);
      this.isBlockPage = true;
      this._subscription.add(
        this._roleService.deleteRolesElement(idElement).subscribe({
          next: (res: Response) => {
            if (res.error) {
              this.isBlockPage = false;
              this._messageService.add({type: 'error', message: 'Error al Deshacer Asignación' + res.msg, life: 5000});
            } else {
              this._messageService.add({
                type: 'success',
                message: 'Deshacer Asignación, Exitosa' + res.msg,
                life: 5000
              });
              const indexRoleElement: number = this.role.role_elements?.findIndex(role => role.element.id === id) || -1;
              this.role.role_elements?.splice(indexRoleElement, 1);
              this.store.dispatch(controlRole({ role: this.role, index: 0 }));
              this.initRoles(this.moduleNameSelect);
            }
          },
          error: (err: HttpErrorResponse) => {
            console.error(err);
            this.isBlockPage = false;
            this._messageService.add({type: 'error', message: err.error.msg, life: 5000});
          }
        })
      );
    }
  }
  /*
    private reloadRolElement(): void {
      this.isBlockPage = true;
      this._subscription.add(
        this._roleService.getRolesElement().subscribe({
          next: (res) => {
            if (res.error) {
              this._messageService.add({type: 'error', message: res.msg, life: 5000});
            } else {
              this.dataRolesElement = res.data;
            }
            this.isBlockPage = false;
          },
          error: (err: HttpErrorResponse) => {
            console.error(err);
            this.isBlockPage = false;
            this._messageService.add({type: 'error', message: err.message, life: 5000});
          }
        })
      );
    }
  */
}
