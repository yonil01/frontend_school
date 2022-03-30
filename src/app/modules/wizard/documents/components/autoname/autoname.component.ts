import {Component, OnInit, Input, EventEmitter, Output, OnDestroy} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {AppState} from '@app/core/store/app.reducers';
import {Response, DocTypes, DocTypeGroups, Entity} from '@app/core/models';
import {EntityService} from '@app/modules/wizard/services/entity/entity.service';
import {DoctypegroupService} from '@app/modules/wizard/services/doctypegroup/doctypegroup.service';
import {ToastService} from "ecapture-ng-ui";
import {Subscription} from "rxjs/internal/Subscription";
import {HttpErrorResponse} from "@angular/common/http";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";

@Component({
  selector: 'app-autoname',
  templateUrl: './autoname.component.html',
  styleUrls: ['./autoname.component.scss'],
})
export class AutonameComponent implements OnInit, OnDestroy {

  private _subscription: Subscription = new Subscription();
  public readonly toastStyle: ToastStyleModel = toastDataStyle;
  value: string = '';
  dataDoctype!: DocTypes;
  isShowAddAutoname: boolean = false;
  autonameForm!: FormGroup;
  keywords1: any[] = [];
  keywords2: any[] = [];
  keywords3: any[] = [];
  selectAtributo: string = '';
  selectEntites: string = '';
  listAttribut: any[] = [];
  selectedKey: any[] = [];
  viewAutoname: string = '';
  viewAutoname2: any[] = [];
  input = '';
  entities: Entity[] = [];
  entityList: Entity[] = [];
  entitiesList: Entity[] = [];
  atribute: any;
  optionsValue: string = '';
  optionsDescription: string = '';
  dataAttrib: string = '';
  project: any;
  doctype!: DocTypes;
  id: string = '';
  indexDocType: number = 0;
  doctypeGruop!: DocTypeGroups;

  public autonames: string[] = [];

  @Input() data_doctype!: DocTypes;
  @Output() cancelAndReturn = new EventEmitter<any>();
  @Output() updateDoctype = new EventEmitter<DocTypes>();

  public isBlockPage: boolean = false;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private entityService: EntityService,
    private doctypegroupService: DoctypegroupService,
    private messageService: ToastService,
  ) {
    this.createForms();
  }

  ngOnInit(): void {
    this.project = JSON.parse(sessionStorage.getItem('project') || '');
    this.keywords1 = [{label: 'Tipo documental', value: 'doctype'}];
    this.selectEntites = '';
    this.selectAtributo = '';
    this.viewAutoname = '';
    this.selectedKey = [];
    this.entityList = [];
    this.entitiesList = [];
    this.getEntitiesByProjectID(this.data_doctype);
    if (this.data_doctype.autoname) {
      this.viewAutoname = this.data_doctype.autoname;
      this.autonames = this.data_doctype.autoname.split('*');
      this.selectedKey = this.data_doctype.autoname.split('*');
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  private createForms(): void {
    this.autonameForm = this.fb.group({
      auto_name: ['', Validators.required],
    });
  }

  private getEntitiesByProjectID(doctype: DocTypes): void {
    this.isBlockPage = true;
    this._subscription.add(
      this.entityService.getEntitiesByProject(this.project.id).subscribe({
        next: (res) => {
          if (res.error) {
            this.messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            if (res.data) {
              this.entityList = res.data;
              if (doctype.doctypes_entities) {
                for (const entity of this.entityList) {
                  const info = Object(doctype.doctypes_entities);
                  const ent = info.find((e: any) => e.entities.id.toLowerCase() === entity.id?.toLowerCase());
                  if (ent) {
                    this.entities.push(entity);
                  }
                }
                this.entitiesList = this.entities;
              }
            } else {
              this.messageService.add({
                type: 'info',
                message: 'No se encontraron entidades realacionadas al proyecto actual!',
                life: 5000
              });
            }
          }
          this.isBlockPage = false;
        },
        error: (err: HttpErrorResponse) => {
          this.isBlockPage = false;
          console.error(err);
          this.messageService.add({type: 'error', message: err.message, life: 5000});
        },
      })
    );
  }

  docty() {
    this.selectedKey.push('doctype');
  }

  onEnter(value: string) {
    if (value) {
      this.selectedKey.push('str|' + value);
    }
  }

  selectedEntity(event: any) {
    this.selectAtributo = '';
    this.optionsDescription = '';
    this.optionsValue = '';
    if (event) {
      this.doctypegroupService.getEntitiesByID(event.id.toLocaleLowerCase()).subscribe((res: Response) => {
        this.listAttribut = res.data.attributes;
      });
    } else {
      this.selectAtributo = '';
      this.optionsDescription = '';
      this.optionsValue = '';
    }
  }

  selectedAtribute(event: any) {
    this.optionsDescription = '';
    this.optionsValue = '';
    if (event) {
      this.optionsDescription = 'attribute-id|' + event.name;
      this.optionsValue = 'attribute-value|' + event.name;
    } else {
      this.optionsDescription = '';
      this.optionsValue = '';
    }
  }

  dataAtribute() {
    const value = this.dataAttrib;
    if (!this.selectedKey.includes(value)) {
      this.selectedKey.push(value);
    }
  }

  verAutoname() {
    this.viewAutoname = '';
    let autoName = '';
    for (const key of this.autonameForm.get('auto_name')?.value) {
      autoName = autoName + key + '*';
      const array = key.replace('str|', '');
    }
    autoName = autoName.slice(0, -1);
    this.viewAutoname = autoName;
  }

  saveAutoname() {
    let autoName = '';
    for (const key of this.autonameForm.get('auto_name')?.value) {
      autoName = autoName + key + '*';
    }
    autoName = autoName.slice(0, -1);
    const doctypes: DocTypes = {
      ...this.data_doctype,
      id: this.data_doctype.id?.toLocaleLowerCase(),
      storage_id: this.data_doctype.storage_id?.toLocaleLowerCase(),
      doctypes_groups_id: this.data_doctype.doctypes_groups_id?.toLocaleLowerCase(),
      autoname: autoName,
    };
    this.confirmUpdateDoctype(doctypes);
    // this.store.dispatch(addAutoname({ autoName: autoName, indexDocType: this.indexDocType }));
  }

  confirmUpdateDoctype(doctype: DocTypes) {
    /*this.confirmationService.confirm({
      message: '¿Está seguro de Agregar el Autoname?',
      header: 'Confimar Actualización Tipo Documental',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.updateDoctype.emit(doctype);
        this.cancel();
      },
      reject: () => {},
    });*/
  }

  cancelAutoname(): void {
    this.cancel();
    this.cancelAndReturn.emit();
    // this.store.dispatch(cancelAutoname());
  }

  cancel() {
    this.selectedKey = [];
    this.viewAutoname = '';
    this.optionsDescription = '';
    this.optionsValue = '';
    this.atribute = [];
  }

  private notifyUser(severity: string, summary: string, detail: string, life: number): void {
    this.messageService.add({
      type: severity,
      message: detail,
      life: life,
    });
  }
}
