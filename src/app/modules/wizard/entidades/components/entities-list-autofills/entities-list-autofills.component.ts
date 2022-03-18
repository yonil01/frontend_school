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
        this.isBlock = false;
        this.autofills.forEach((autofill) => {
          autofill.showConfig = false;
        });
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


  onCreateEditAutofill(index?: number) {
    if (index != undefined) {
      this.selectedAutofill = this.autofills[index];
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

  sureDelete(i: number) {
    if (this.selectedAutofill) { // @ts-ignore
      delete this.selectedAutofill;
    }
    this.selectedAutofill = this.autofills[i];
    this.isDelete = true;
  }

  onShowConfig(i: number) {
    this.selectedAutofill = this.autofills[i];
    this.autofills[i].showConfig = !this.autofills[i].showConfig
  }

  onAddAttributes(i: number) {
    this.showAutofillsList = false;
    this.showAddAttribute = true;
    this.selectedAutofill = this.autofills[i];
  }

  onAddValues(i: number) {
    this.selectedAutofill = this.autofills[i];
    this.showAddValues = true;
    this.showAutofillsList = false;
  }
}
