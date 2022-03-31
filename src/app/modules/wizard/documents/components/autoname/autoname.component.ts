import {Component, OnInit, Input, EventEmitter, Output, OnDestroy} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {AppState} from '@app/core/store/app.reducers';
import {DocTypes, DocTypeGroups, Entity} from '@app/core/models';
import {EntityService} from '@app/modules/wizard/services/entity/entity.service';
import {DoctypegroupService} from '@app/modules/wizard/services/doctypegroup/doctypegroup.service';
import {ToastService} from "ecapture-ng-ui";
import {Subscription} from "rxjs/internal/Subscription";
import {HttpErrorResponse} from "@angular/common/http";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {DropdownModel} from "ecapture-ng-ui/lib/modules/dropdown/models/dropdown";
import {dropStyle} from "@app/core/models/dropdown/dropdown";

@Component({
  selector: 'app-autoname',
  templateUrl: './autoname.component.html',
  styleUrls: ['./autoname.component.scss'],
})
export class AutonameComponent implements OnInit, OnDestroy {

  private _subscription: Subscription = new Subscription();
  public readonly toastStyle: ToastStyleModel = toastDataStyle;
  public readonly dropStyle: DropdownModel = dropStyle;
  public showConfirmDelete: boolean = false;
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
  public entitiesList: Entity[] = [];
  public attributesSelected: Entity[] = [];
  atribute: any;
  public optionsValue: string = '';
  public optionsDescription: string = '';
  public dataAttributeRadio: string = '';
  project: any;
  doctype!: DocTypes;
  id: string = '';
  indexDocType: number = 0;
  doctypeGruop!: DocTypeGroups;

  public autonames: string[] = [];
  public showValuesAttributes: boolean = false;

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
    this.entities = [];
    this.entityList = [];
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

  public addDocType(): void {
    this.autonames.push('doctype');
  }

  public onEnter(value: string): void {
    if (value) {
      this.autonames.push('str|' + value);
    }
  }

  public selectedEntity(event: any): void {
    this.selectAtributo = '';
    this.optionsDescription = '';
    this.optionsValue = '';
    if (event) {
      const entity = this.entitiesList.find((e: any) => e.id.toLowerCase() === event.toLowerCase());
      if (entity) {
        this.isBlockPage = true;
        this._subscription.add(
          this.doctypegroupService.getEntitiesByID(entity.id?.toLocaleLowerCase() || '').subscribe({
            next: (res) => {
              if (res.error) {
                this.messageService.add({type: 'error', message: res.msg, life: 5000});
              } else {
                this.attributesSelected = res.data.attributes;
              }
              this.isBlockPage = false;
            },
            error: (err: HttpErrorResponse) => {
              this.isBlockPage = false;
              console.error(err);
              this.messageService.add({type: 'error', message: err.message, life: 5000});
            }
          })
        );
      }
    } else {
      this.selectAtributo = '';
      this.optionsDescription = '';
      this.optionsValue = '';
    }
  }

  public selectedAttribute(event: any): void {
    this.showValuesAttributes = true;
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

  public dataAttribute(): void {
    if (!this.autonames.includes(this.dataAttributeRadio)) {
      this.autonames.push(this.dataAttributeRadio);
    }
  }

  public saveAutoname(): void {
    const docTypes: DocTypes = {
      ...this.data_doctype,
      id: this.data_doctype.id?.toLocaleLowerCase(),
      storage_id: this.data_doctype.storage_id?.toLocaleLowerCase(),
      doctypes_groups_id: this.data_doctype.doctypes_groups_id?.toLocaleLowerCase(),
      autoname: this.autonames.join('*'),
    };
    this.updateDoctype.emit(docTypes);
  }

  public cancelAutoname(): void {
    this.cancel();
    this.cancelAndReturn.emit();
  }

  private cancel(): void {
    this.selectedKey = [];
    this.viewAutoname = '';
    this.optionsDescription = '';
    this.optionsValue = '';
    this.atribute = [];
  }

  public confirmDeleteAutoname(event: boolean): void {
    if (event) {
      const docTypes: DocTypes = {
        ...this.data_doctype,
        id: this.data_doctype.id?.toLocaleLowerCase(),
        storage_id: this.data_doctype.storage_id?.toLocaleLowerCase(),
        doctypes_groups_id: this.data_doctype.doctypes_groups_id?.toLocaleLowerCase(),
        autoname: '',
      };
      this.updateDoctype.emit(docTypes);
      this.cancel();
    } else {
      this.showConfirmDelete = false;
    }
  }

  public removeAutoname(index: number): void {
    this.autonames.splice(index, 1);
  }
}
