import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ReturnData} from "@app/modules/wizard/entidades/models/entities.models";
import {LocalStorageService} from "@app/core/services/local-storage/local-storage.service";
import {AutofillsService} from "@app/modules/wizard/entidades/services/autofills/autofills.service";
import {Autofill, Entity, Response} from "@app/core/models";
import {ToastModel, ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {ToastService} from "ecapture-ng-ui";

@Component({
  selector: 'app-entities-list-autofills',
  templateUrl: './entities-list-autofills.component.html',
  styleUrls: ['./entities-list-autofills.component.scss']
})
export class EntitiesListAutofillsComponent implements OnInit {
  @Input()
  public entity!: Entity;
  public nameClient: string = '';
  public nameProject: string = '';
  @Output()
  public onReturnList: EventEmitter<ReturnData> = new EventEmitter<ReturnData>();
  public autofills: Autofill[] = [];
  public showCreateEditAutofill: boolean = false;
  public showAutofillsList: boolean = true;
  public selectedAutofill!: Autofill;
  public toastStyle: ToastStyleModel = toastDataStyle;
  public isBlock: boolean = false;
  public isDelete: boolean = false;
  public showAddAttribute: boolean = false;
  public showAddValues: boolean = false;
  public tableIndex: number = 0;
  public currentRowPage: number = 0;
  public autofillsTable: any;
  public dataTemp: any = [];

  private readonly entityLoadAutofill = 'ea305aa7-4e5e-4d52-96cc-280787ee8efc';
  public showModalImportAutofill: boolean = false;

  constructor(private _localStorage: LocalStorageService,
              private autofillsService: AutofillsService,
              private messageService: ToastService
  ) {
    this.nameClient = this._localStorage.getClient();
    this.nameProject = this._localStorage.getProject();
  }

  ngOnInit(): void {
    if (this.entity.id) {
      this.isBlock = true;
      this.autofillsService.getAutofillsByEntityID(this.entity.id).subscribe((res) => {
        this.autofills = res.data ? JSON.parse(JSON.stringify(res.data)) : [];
        this.autofills.forEach((autofill) => {
          autofill.showConfig = false;
        });
        this.isBlock = false;
      });
    }
  }

  onChangeOption(where: string) {
    this.onReturnList.emit({
      id: where,
      from: 'autofills',
      value: true,
    });
  }


  onCreateEditAutofill(autofill?: any) {
    if (autofill != undefined) {
      this.selectedAutofill = this.autofills[this.autofills.indexOf(autofill)];
    }
    this.showCreateEditAutofill = true;
    this.showAutofillsList = false;

  }

  onShowHome($event: ReturnData) {
    // @ts-ignore
    delete this.selectedAutofill;
    if (this.entity.id)
      this.getAutofills(this.entity.id.toLowerCase());
    switch ($event.from) {
      case 'create':
        this.showCreateEditAutofill = false;
        break;
      case 'addAtribute':
        this.showAddAttribute = false;
        break;
      case 'addValues':
        this.showAddValues = false;
        break;
    }
    this.showAutofillsList = true;
    this.showCreateEditAutofill = false;
  }

  toastMessage($event: ToastModel) {
    this.messageService.add($event);
  }

  cancelDelete() {
    this.isDelete = false;
    // @ts-ignore
    delete this.selectedAutofill;
  }

  deleteAutofill() {
    this.isBlock = true;
    if (this.selectedAutofill.id)
      this.autofillsService.deleteAutofills(this.selectedAutofill.id.toLowerCase()).subscribe((res: Response) => {
        if (res.error) {
          this.messageService.add({type: 'error', message: 'Error en la eliminación' + res.msg, life: 5000});
          this.isBlock = false;
          this.isDelete = false;
        } else {
          this.messageService.add({type: 'success', message: 'Eliminación Exitosa', life: 5000});
          this.isBlock = false;
          this.isDelete = false;
          if (this.entity.id) {
            this.getAutofills(this.entity.id.toLowerCase());
          } else {
            this.messageService.add({type: 'success', message: 'Actualice la página para ver los cambios', life: 5000});
          }
        }
      });
  }

  getAutofills(entityId: string): void {
    this.autofillsService.getAutofillsByEntityID(entityId).subscribe((res) => {
      this.autofills = res.data ? JSON.parse(JSON.stringify(res.data)) : [];
    });
  }

  sureDelete(autofill: any) {
    if (this.selectedAutofill) { // @ts-ignore
      delete this.selectedAutofill;
    }
    this.selectedAutofill = this.autofills[this.autofills.indexOf(autofill)];
    this.isDelete = true;
  }

  onShowConfig(autofill: any) {
    this.selectedAutofill = this.autofills[this.autofills.indexOf(autofill)];
    this.selectedAutofill.showConfig = !this.selectedAutofill.showConfig
  }

  onAddAttributes(autofill: any) {
    this.showAutofillsList = false;
    this.showAddAttribute = true;
    this.selectedAutofill = this.autofills[this.autofills.indexOf(autofill)];
  }

  onAddValues(autofill: any) {
    this.selectedAutofill = this.autofills[this.autofills.indexOf(autofill)];
    this.showAutofillsList = false;
    this.showAddValues = true;
  }
  getData($event: any) {
    this.autofillsTable = $event;
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
      this.autofills = this.dataTemp;
      this.autofillsTable = this.dataTemp;
    } else {
      this.dataTemp = this.autofills;
      this.autofillsTable = this.autofills;
    }
    this.autofills = this.autofills?.filter((m: any) => {
      if (m.name.toLowerCase().indexOf(data) !== -1) {
        return m;
      }
    });
    this.autofillsTable = this.autofillsTable?.filter((m: any) => {
      if (m.name.toLowerCase().indexOf(data) !== -1) {
        return m;
      }
    });
    if (data === '') {
      this.autofills = this.dataTemp;
      this.autofillsTable = this.dataTemp;
    }
  }

  public readonly validEntityLoadAutofill = () => this.entity ? this.entity.id === this.entityLoadAutofill : false;

  onReturn() {
    this.onReturnList.emit({
      id: 'list',
      from: 'list',
      value: true,
    });
  }
}
