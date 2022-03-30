import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "@app/core/store/app.reducers";
import {Router} from "@angular/router";
import {Elements, Response, Role} from "@app/core/models";
import {FormBuilder} from "@angular/forms";
import {EntityService} from "@app/modules/wizard/services/entity/entity.service";
import {DoctypegroupService} from "@app/modules/wizard/services/doctypegroup/doctypegroup.service";
import {RoleService} from "@app/modules/wizard/services/roles/role.service";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {ToastService} from "ecapture-ng-ui";
import { v4 as uuidv4 } from 'uuid';
import {addElement, deleteRoleElement} from "@app/core/store/actions/roles.action";

interface Modulo {
  id: string;
  name: string;
  description: string;
  components: Componente[];
}

interface ReduxElement {
  id: string;
  element: Elemento;
}

interface Componente {
  id: string;
  module_id: string;
  name: string;
  description: string;
  url_front: string;
  elements: Elemento[];
}

interface Elemento {
  id: string;
  name: string;
  description: string;
  url_back: string;
  component_id: string;
  checked: number;
}

@Component({
  selector: 'app-roles-privilege',
  templateUrl: './roles-privilege.component.html',
  styleUrls: ['./roles-privilege.component.scss']
})
export class RolesPrivilegeComponent implements OnInit {

  public readonly toastStyle: ToastStyleModel = toastDataStyle;
  public isBlockPage: boolean = false;

  public role: Role = {};

  moduloElemento: Modulo[] = [];
  rolesElements: Elements[] = [];
  componenteElemento: Componente[] = [];
  elemento: Elemento[] = [];

  selectedValues: Elemento[] = [];
  // @ts-ignore
  dataElemenRedux: ReduxElement;
  // @ts-ignore
  dataRolesElement: Elemento;

  public moduloSelected: Modulo = this.moduloElemento[0];

  constructor(
    private formBulder: FormBuilder,
    private _roleService: RoleService,
    private entityService: EntityService,
    private store: Store<AppState>,
    private doctypegroupService: DoctypegroupService,
    private router: Router,
    private _messageService: ToastService,
  ) {
    this.store.select('role').subscribe((res) => {
      this.role = res.role;
      if (!this.role || Object.keys(this.role).length === 0) this.router.navigateByUrl('wizard/roles');
    });
  }

  ngOnInit(): void {
    this.initRoles();
  }

  initRoles(): void {
    if (this.role !== null) {
      this.isBlockPage = true;
      this._roleService.getModules().subscribe((res: Response) => {
        if(!res.error){
          const dat = res.data;
          if (this.role.role_elements !== null && this.role?.role_elements) {
            this.rolesElements = this.role.role_elements;
          }

          this.moduloElemento = dat;
          console.log(this.moduloElemento[3].components.length);

          console.log(dat);
          console.log(this.moduloElemento);
          console.log(this.rolesElements);
          this.isBlockPage = false;
          this._messageService.add({
            type: 'error',
            message: res.msg,
            life: 5000
          });
        }
      });
    }
  }
  //initRoles end

  showPrivileges(modulo: Modulo) {
    this.moduloSelected = modulo;
  }

  changeCheck(event: any, data: Elemento): void {
    if (event.checked === false) {
      const id = data.id;
      const element = Object(this.role.role_elements).find((el: { element: { id: string; }; }) => el.element?.id === id);
      const idElement = element.id.toLocaleLowerCase();
      const indexElement = this.role.role_elements?.findIndex((el) => el.id === element.id);
      this._roleService.deleteRolesElement(idElement).subscribe((res: Response) => {
        if (res.error) {
          this._messageService.add({
            type: 'error',
            message: 'Error al Deshacer Asignación'+res.msg,
            life: 5000
          });
        } else {
          this._messageService.add({
            type: 'success',
            message: 'Deshacer Asignación, Exitosa'+res.msg,
            life: 5000
          });
          // @ts-ignore
          this.store.dispatch(deleteRoleElement({ indexRoleElement: indexElement }));
        }
      });
    } else {
      const id = data.id.toLocaleLowerCase();
      const dataElemento: Elements = {
        id: uuidv4().toLowerCase(),
        element_id: data.id.toLocaleLowerCase(),
        role_id: this.role.id?.toLocaleLowerCase(),
      };
      const dataE = JSON.parse(JSON.stringify(dataElemento));
      this.dataElemenRedux = { id: dataE.id, element: { ...data } };
      this._roleService.createRolesElement(dataE).subscribe((res: Response) => {
        if (res.error) {
          this._messageService.add({
            type: 'error',
            message: 'Error en la Asignación'+res.msg,
            life: 5000
          });
        } else {
          this._messageService.add({
            type: 'success',
            message: 'Asignación Exitosa'+res.msg,
            life: 5000
          });
          this.reloadRolElement();
          this.store.dispatch(addElement({ element: this.dataElemenRedux }));
        }
      });
    }
  }

  reloadRolElement() {
    this._roleService.getRolesElement().subscribe((res: Response) => {
      this.dataRolesElement = res.data;
    });
  }



}
