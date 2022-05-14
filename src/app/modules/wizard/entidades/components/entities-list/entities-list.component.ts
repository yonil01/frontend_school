import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LocalStorageService} from "@app/core/services/local-storage/local-storage.service";
import {ReturnData} from "@app/modules/wizard/entidades/models/entities.models";
import {Attribute, Entity, Response} from "@app/core/models";
import {ToastModel, ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {ToastService} from "ecapture-ng-ui";
import {EntityService} from "@app/modules/wizard/entidades/services/entities.service";
import {Store} from "@ngrx/store";
import {AppState} from "@app/core/store/app.reducers";
import {addAttribute} from "@app/core/store/actions/entity.action";
import {AutofillsService} from "@app/modules/wizard/entidades/services/autofills/autofills.service";

@Component({
  selector: 'app-entities-list-atributes',
  templateUrl: './entities-list.component.html',
  styleUrls: ['./entities-list.component.scss']
})
export class EntitiesListComponent implements OnInit {
  public nameClient: string = '';
  public nameProject: string = '';
  @Input()
  public project: any;
  @Input()
  public selectedEntity!: Entity;
  @Output()
  public isReturn: EventEmitter<ReturnData> = new EventEmitter<ReturnData>();
  public onSelectAutofills: boolean = false;
  public attributes: any[] = [];
  public showAtributtes: boolean = true;
  public onSelectCreateAtribute: boolean = false;
  public selectedAttribute!: any;
  public onShowEditAttribute: boolean = false;
  public toastStyle: ToastStyleModel = toastDataStyle;
  public nAttributes: number = 0;
  public onSelectCascade: boolean = false;
  public onConfigDatasets: boolean = false;
  public isDelete: boolean = false;
  public showAddDataset: boolean = false;
  public tableIndex: number  = 0;
  public currentRowPage: number = 0;
  public attributesTable: any[] = [];
  public dataTemp: any = [];

  constructor(private _localStorage: LocalStorageService,
              private messageService: ToastService,
              private entityService: EntityService,
              private store: Store<AppState>,
              private autofillService: AutofillsService
  ) {
    this.nameClient = this._localStorage.getClient();
    this.nameProject = this._localStorage.getProject();
  }

  ngOnInit(): void {
    if (this.selectedEntity.attributes) {
      this.nAttributes = this.selectedEntity.attributes.length;
      this.selectedEntity.attributes.forEach(attribute => {
        this.attributes.push({
          showConfig: false,
          name: attribute.name,
          type: attribute.type,
          id: attribute.id,
          is_index: attribute.is_index,
          disabled: attribute.disabled,
          hidden: attribute.hidden,
          required: attribute.required,
          is_cipher: attribute.is_cipher,
          dataset: attribute.dataset,
          regex: attribute.regex,
          max_length: attribute.max_length,
          min_length: attribute.min_length,
          sequence: attribute.sequence,
          mask: attribute.mask,
          field_types: attribute.field_types,
          tag_html: attribute.tag_html,
          validation: attribute.validation,
          description: attribute.description,
          entities_id: attribute.entities_id,
          autofill: attribute.autofill,
          autofill_attributes: attribute.autofill_attributes,
          entities_attributes_autofills: attribute.entities_attributes_autofills,
          cascading_datasets: attribute.cascading_datasets,
          entities_attributes_cascading_dataset: attribute.entities_attributes_cascading_dataset,
          entities_attributes_dataset: attribute.entities_attributes_dataset
        });
      });
    }
  }

  onReturn() {
    this.isReturn.emit({
      id: 'list',
      from: 'list',
      value: true
    });
  }

  onShowListEntity($event: any) {
    switch ($event.from) {
      case 'cascade':
        this.onSelectCascade = false;
        break;
      case 'autofill':
        this.onSelectAutofills = false;
        break;
      case 'atribute':
        this.showAtributtes = false;
        break;
      case 'createAtribute':
        this.onSelectCreateAtribute = false;
        if ($event.value != null) {
          this.attributes.push($event.value)
        }
        break;
      case 'updateAtribute':
        // @ts-ignore
        delete this.selectedAttribute
        this.onSelectCreateAtribute = false;
        if ($event.value != null) {
          this.attributes[this.attributes.findIndex(x => x.id === $event.value.id)].assign($event.value);
        }
        break;
      case 'addDataset':
        this.showAddDataset = false;
        break;
    }
    switch ($event.id) {
      case 'autofill':
        this.onSelectAutofills = true;
        break;
      case 'cascade':
        this.onSelectCascade = true;
        break;
      case 'atribute':
        this.showAtributtes = true;
        break;
    }
  }

  onShowAutofills() {
    this.onSelectAutofills = true;
    this.showAtributtes = false;
  }

  onShowCascadings() {
    this.onSelectCascade = true;
    this.showAtributtes = false;
  }

  onChangeOption($event: ReturnData) {
    switch ($event.id) {
      case 'autofills':
        this.onSelectAutofills = true;
        break;
      case 'cascadings':
        this.onSelectCascade = true;
        break;
      case 'atribute':
        this.showAtributtes = true;
        break;
    }
    switch ($event.from) {
      case 'autofills':
        this.onSelectAutofills = false;
        break;
      case 'cascadings':
        this.onSelectCascade = false;
        break;
      case 'atribute':
        this.showAtributtes = false;
        break;
    }
  }

  onCreateAtribute() {
    // @ts-ignore
    delete this.selectedAttribute
    this.onSelectCreateAtribute = true;
    this.showAtributtes = false;
  }

  onEditAttribute(atribute: any) {
    if (this.attributes) {
      this.onSelectCreateAtribute = true;
      this.showAtributtes = false;
      if (this.attributes[this.attributes.indexOf(atribute)]) {
        this.selectedAttribute = this.attributes[this.attributes.indexOf(atribute)];
      }
    } else {
      console.log("No hay atributos");
    }
  }

  toastMessage($event: ToastModel
  ) {
    this.messageService.add($event);
  }

  onSelectDataset(atribute: any) {
    this.selectedAttribute = this.attributes[this.attributes.indexOf(atribute)];
    this.selectedAttribute.showConfig = !this.selectedAttribute.showConfig;
  }

  deleteAttribute() {
    if (this.selectedAttribute.id) {
      this.entityService.deleteAttribute(this.selectedAttribute.id.toLowerCase()).subscribe((res: Response) => {
        if (res.error) {
          this.messageService.add({
            message: res.msg,
            type: 'error',
            life: 3000
          });
        } else {
          this.messageService.add({
            message: "Eliminación exitosa, actualice la página para ver los cambios",
            type: 'sucess',
            life: 3000
          });
          this.isDelete = false;
        }
      });
    }
  }

  cancelDelete() {
    this.isDelete = false;
    // @ts-ignore
    delete this.selectedAttribute;
  }

  sureDelete(atribute: any) {
    if (this.attributes) {
      this.selectedAttribute = this.attributes[this.attributes.indexOf(atribute)];
      this.isDelete = true;
    }
  }

  onAddDatasets(atribute: any) {
    this.selectedAttribute = this.attributes[this.attributes.indexOf(atribute)];
    this.showAtributtes = false;
    this.showAddDataset = true;
  }
  getData($event: any) {
    this.attributesTable = $event;
  }

  getCurrentRowPage($event: number) {
    if (this.tableIndex == 1) {
      this.currentRowPage = 0;
    } else {
      this.currentRowPage = $event;
    }
  }

  getCurrentPage($event: number) {
    this.tableIndex = $event;
  }

  public findForm(value: any): void {
    let data = value.target.value;
    data = data.toLowerCase();
    if (this.dataTemp.length > 0) {
      this.attributes = this.dataTemp;
      this.attributesTable = this.dataTemp;
    } else {
      this.dataTemp = this.attributes;
      this.attributesTable = this.attributes;
    }
    this.attributes = this.attributes?.filter((m: any) => {
      if (m.name.toLowerCase().indexOf(data) !== -1) {
        return m;
      }
    });
    this.attributesTable = this.attributesTable?.filter((m: any) => {
      if (m.name.toLowerCase().indexOf(data) !== -1) {
        return m;
      }
    });
    if (data === '') {
      this.attributes = this.dataTemp;
      this.attributesTable = this.dataTemp;
    }
  }
}
