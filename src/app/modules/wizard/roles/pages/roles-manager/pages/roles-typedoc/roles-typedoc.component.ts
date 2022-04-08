import {Component, OnDestroy, OnInit} from '@angular/core';
import {DocTypeGroups, DocTypes, Role, Response} from "@app/core/models";
import {v4 as uuidv4} from "uuid";
import {Subscription} from "rxjs/internal/Subscription";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {dropStyle} from "@app/core/models/dropdown/dropdown";
import {RoleService} from "@app/modules/wizard/services/roles/role.service";
import {ToastService} from "ecapture-ng-ui";
import {DoctypegroupService} from "@app/modules/wizard/services/doctypegroup/doctypegroup.service";
import {Store} from "@ngrx/store";
import {AppState} from "@app/core/store/app.reducers";
import {Router} from "@angular/router";
import {DropdownModel} from "ecapture-ng-ui/lib/modules/dropdown/models/dropdown";

export interface RolesDoctype {
  id?: string;
  doctype_id?: string;
  role_id?: string;
}

interface OptionsDropdown {
  label: string;
  value: string;
}

@Component({
  selector: 'app-roles-typedoc',
  templateUrl: './roles-typedoc.component.html',
  styleUrls: ['./roles-typedoc.component.scss']
})
export class RolesTypedocComponent implements OnInit, OnDestroy {

  isActive:boolean = false;

  private _subscription: Subscription = new Subscription();

  public readonly toastStyle: ToastStyleModel = toastDataStyle;
  public dropStyle: DropdownModel = dropStyle;
  public isBlockPage: boolean = false;
  public role: any = {};

  sourceDoctypeDrop: OptionsDropdown[] = [];

  doctypes: DocTypes[] = [];
  public doctypesSelected: DocTypes[] = [];
  public doctypesOfGroupSelected: DocTypes[] = [];
  public doctypesAvailable: DocTypes[] = [];
  sourceDoctype: DocTypeGroups[] = [];
  selectedDtg: DocTypeGroups[] = [];

  groupDocIdSelected = '';

  constructor(
    private _roleService: RoleService,
    private _messageService: ToastService,
    private doctypegroupService: DoctypegroupService,
    private store: Store<AppState>,
    private router: Router,
  ) {
    this.store.select('role').subscribe((res) => {
      this.role = JSON.parse(JSON.stringify(res.role));
      if (!this.role || Object.keys(this.role).length === 0) this.router.navigateByUrl('wizard/roles');
      if(this.role.roles_doc_types){
        for(let doc of this.role.roles_doc_types){
          this.doctypesSelected.push(doc);
        }
      }
    });
  }

  ngOnInit(): void {
    this.doctypegroupService.getDoctypeGroupsProject().subscribe((res: Response) => {
      this.sourceDoctype = res.data;
      for(let doc of this.sourceDoctype){
        this.sourceDoctypeDrop.push({
          label: doc.name || '',
          value: doc.id || ''
        });
      }
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  getRolesDoctypes(){
    this._roleService.getRoles().subscribe((res: Response) => {
      if(!res.error){
        const data = res.data ? JSON.parse(JSON.stringify(res.data)) : [];
        this.role = data.find((doc: any) => doc.id?.toLowerCase() === this.role.id?.toLowerCase()) || this.role;
        this.changeGroupDoctype(this.groupDocIdSelected);
      }else{
        this._messageService.add({
          type: 'error',
          message: 'Recargue la página - '+res.msg,
          life: 5000
        });
      }
      this.isBlockPage = false;
    });
  }

  public assignItemsDoctypes(datos: string[]): void {
    console.log(this.role);
    const doctypeAlloweds: RolesDoctype[] = [];
    for (const doc of datos) {
      const doctypeAllowed: RolesDoctype = {
        id: uuidv4().toLowerCase(),
        doctype_id: doc,
        role_id: this.role.id?.toLowerCase(),
      };
      doctypeAlloweds.push(doctypeAllowed);
    }
    this.isBlockPage = true;
    this._subscription.add(
      this._roleService.createRolesDoctype(doctypeAlloweds).subscribe({
        next: (res) => {
          if (res.error) {
            this._messageService.add({message: res.msg, type: 'error', life: 5000});
          } else {
            this._messageService.add({
              message: 'Se asigno correctamente los tipos documentales al rol',
              type: 'success',
              life: 5000
            });
            for (const allow of doctypeAlloweds) {
              const roles = this.doctypes.find(d => d.id === allow.role_id);
              if (roles) {
                this.doctypesSelected.push(roles);
                this.doctypesAvailable = this.doctypesAvailable.filter(d => d.id !== roles.id);
              }
            }
          }
          //Actualizar las listas
          this.getRolesDoctypes();

          this.isBlockPage = false;
        },
        error: (err: Error) => {
          this.isBlockPage = false;
          console.error(err.message);
          this._messageService.add({
            message: 'Ocurrio un error cuando se trato de agregar los tipos documentales al rol!',
            type: 'error',
            life: 5000
          });
        }
      })
    );
  }

  public unAssignItemsDoctypes(datos: string[]): void {
    console.log(this.role);
    this.isBlockPage = true;
    if (datos) {
      let ids: string[] = [];
      for(let docu of datos){
        const role_doc = this.role.roles_doc_types.find((doc:any) => doc.doctype.id?.toLowerCase() === docu.toLowerCase());
        if(role_doc){
          ids.push(role_doc.id);
        }
      }
      this._subscription.add(
        this._roleService.deleteRolesDoctype(ids || '').subscribe({
          next: (res) => {
            if (res.error) {
              this._messageService.add({message: res.msg, type: 'error', life: 5000});
            } else {
              this._messageService.add({
                message: 'Se elimino correctamente el tipo documental del rol',
                type: 'success',
                life: 5000
              });
              for (const doctype of datos) {
                this.role.roles_doc_types = this.role.roles_doc_types?.filter((pdt:any) => pdt.id?.toLowerCase() !== doctype.toLowerCase());
                this.doctypesSelected = this.doctypesSelected.filter((roles) => roles.id?.toLowerCase() !== doctype.toLowerCase());
                const doc = this.doctypes.find((doc) => doc.id?.toLowerCase() === doctype.toLowerCase());
                if (doc) {
                  this.doctypesAvailable.push(doc);
                }
              }
            }
            //Actualizar las listas
            this.getRolesDoctypes();
            this.isBlockPage = false;
          },
          error: (err: Error) => {
            this.isBlockPage = false;
            this._messageService.add({
              message: 'Ocurrio un error cuando se trato de eliminar el tipo documental del rol!',
              type: 'error',
              life: 5000
            });
            console.error(err.message);
          }
        })
      );
    }
  }

  changeGroupDoctype(event: any){
    this.isBlockPage = true;

    this.doctypesOfGroupSelected = [];
    this.doctypesAvailable = [];
    this.groupDocIdSelected = event;
    const groupDoc = this.sourceDoctype.find((el) => el.id === this.groupDocIdSelected);
    if(groupDoc?.doctypes){
      for(let doctype of groupDoc.doctypes){
        const doctypeExist = this.role.roles_doc_types.find((el:any) => el.doctype.id?.toLowerCase() === doctype.id?.toLowerCase());
        if(doctypeExist){
          this.doctypesOfGroupSelected.push(doctype);
        }else{
          this.doctypesAvailable.push(doctype);
        }
      }
    }
    this.isBlockPage = false;
  }

}
