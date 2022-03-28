import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "@app/core/store/app.reducers";
import {Router} from "@angular/router";
import {Response, Role} from "@app/core/models";
import {FormBuilder} from "@angular/forms";
import {EntityService} from "@app/modules/wizard/services/entity/entity.service";
import {DoctypegroupService} from "@app/modules/wizard/services/doctypegroup/doctypegroup.service";
import {RoleService} from "@app/modules/wizard/services/roles/role.service";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {ToastService} from "ecapture-ng-ui";

interface Modulo {
  idM: string;
  nameModulo: string;
  component: Componente[];
}

interface Componente {
  idC: string;
  nameComponente: string;
  elemen: Elemento[];
  idModulo: string;
}

interface Elemento {
  id: string;
  name: string;
  description: string;
  url_backt: string;
  component_id: string;
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
  componenteElemento: Componente[] = [];
  elemento: Elemento[] = [];

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
          this.moduloElemento = [];
          for (let h = 0; h < dat.length; h++) {
            this.componenteElemento = [];
            const datos = dat[h].components;
            if (datos !== null) {
              for (let i = 0; i < datos.length; i++) {
                this.elemento = [];
                const elements = datos[i].elements;
                for (let j = 0; j < elements.length; j++) {
                  const nombre = elements[j].name;
                  const desElemento = elements[j].description;
                  const url = elements[j].url_back;
                  this.elemento.push({
                    id: elements[j].id,
                    component_id: datos[i].id,
                    name: nombre,
                    description: desElemento,
                    url_backt: url,
                  });
                }
                this.componenteElemento.push({
                  idC: datos[i].id,
                  nameComponente: datos[i].name,
                  elemen: this.elemento,
                  idModulo: dat[h].id,
                });
              }
              this.moduloElemento.push({idM: dat[h].id, nameModulo: dat[h].name, component: this.componenteElemento});
              this.moduloSelected = this.moduloElemento[0];
            }
          }
          this.isBlockPage = false;
        }else{
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


}
