import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LocalStorageService} from "@app/core/services/local-storage/local-storage.service";
import {ReturnData} from "@app/modules/wizard/entidades/models/entities.models";
import {
  Attribute,
  AttributeAutofill, AttributeResponse,
  Autofill,
  AutofillsValues,
  DatasetValue, Response, ResponseGetAttributesAutofill, ResponseGetValuesAtributtesAutofill,
} from "@app/core/models";
import {AutofillsService} from "@app/modules/wizard/entidades/services/autofills/autofills.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MessageServices} from "@app/modules/administration/services/message/message.service";
import {ToastService} from "ecapture-ng-ui";

@Component({
  selector: 'app-entity-list-values',
  templateUrl: './entity-list-values.component.html',
  styleUrls: ['./entity-list-values.component.scss']
})
export class EntityListValuesComponent implements OnInit {
  public nameClient: string = '';
  public nameProject: string = '';
  @Input()
  public selectedAutofill!: Autofill;
  @Output()
  public isReturn: EventEmitter<ReturnData> = new EventEmitter<ReturnData>();
  public onSelectAutofills: boolean = false;
  public attributes: Attribute[] = [];
  public isDelete: boolean = false;
  public showValues: boolean = true;
  public attributeAutofills: AttributeAutofill[] = [];
  public isBlock: boolean = true;
  public ResponsevaluesAttributesAutofills: ResponseGetValuesAtributtesAutofill[] = [];
  public valuesAttributesAutofills: Array<any> = [];
  public ResponseAtrributesOfAutofills: ResponseGetAttributesAutofill[] = [];
  public AttributesOfAutofills: AttributeResponse[] = [];
  public hasAttribute: boolean = true;
  public columnsTable: any[] = [];
  public form = new FormGroup({});
  public showCreateValue: boolean = false;
  public selectedValue: any;
  public tableIndex: number = 0;
  public currentRowPage: number = 0;
  public valuesAttributesAutofillsTable: any;


  constructor(private _localStorage: LocalStorageService,
              private autofillsService: AutofillsService,
              private messageService: ToastService,
  ) {
    this.nameClient = this._localStorage.getClient();
    this.nameProject = this._localStorage.getProject();
  }

  ngOnInit(): void {
    if (this.selectedAutofill) {
      this.getAutofillValues();
    } else {
      this.isBlock = false;
    }
  }


  getAutofillValues(): void {
    this.isBlock = true;
    this.valuesAttributesAutofills = [];
    this.autofillsService.getAllAutofillValues(this.selectedAutofill.id?.toLowerCase() || '').subscribe((res) => {
      if (res.data?.autofill_response?.length) {
        this.ResponsevaluesAttributesAutofills = JSON.parse(JSON.stringify((res.data.autofill_response)));
        this.valuesAttributesAutofills = res.data.autofill_response;
        this.valuesAttributesAutofills.forEach((value: ResponseGetValuesAtributtesAutofill) => {
          // @ts-ignore
          delete value.id
          // @ts-ignore
          delete value.created_at
          // @ts-ignore
          delete value.updated_at
        });
        this.columnsTable = Object.keys(this.valuesAttributesAutofills[0])
      } else {
        this.ResponsevaluesAttributesAutofills = [];
      }
      this.AttributesOfAutofills = [];
      this.autofillsService.getAttributeAutofillsByAutofillID(this.selectedAutofill.id?.toLowerCase() || '').subscribe(
        async (res) => {
          this.ResponseAtrributesOfAutofills = res.data;
          for (const autofill of this.ResponseAtrributesOfAutofills) {
            this.AttributesOfAutofills.push(autofill.attribute);
          }
          this.isBlock = false;
        }, (error) => {
          console.log(error);
          this.isBlock = false;
        });

    }, (error) => {
      console.log(error);
      this.isBlock = false;
    });
  }

  onReturn() {
    this.isReturn.emit({
      id: 'autofills',
      from: 'addValues',
      value: true
    });
  }

  onShowHome($event: any) {
    switch ($event.id) {
      case 'values':
        this.showValues = true;
        break;
    }
    switch ($event.from) {
      case 'createValues':
        this.showCreateValue = false;
        break;
    }
    if ($event.action == 'reloadValues') {
      this.getAutofillValues();
    }
  }

  cancelDelete() {
    this.isDelete = false;
  }

  sureDelete(i: number) {
    if (this.attributes) {
      this.isDelete = true;
    }
  }

  onAddDatasets(i: number) {
    this.showValues = false;
  }

  onCreateValue() {
    this.showCreateValue = true;
    this.showValues = false;
  }

  confirmDelete(value: any) {
    this.selectedValue = this.ResponsevaluesAttributesAutofills[this.ResponsevaluesAttributesAutofills.indexOf(value)];
    this.isDelete = true;
  }

  onDelete($event: boolean) {
    if ($event) {
      if (this.selectedAutofill.id)
        this.autofillsService.deleteAutofillValue(this.selectedValue.id, this.selectedAutofill.id.toLowerCase()).subscribe((res) => {
          if (res.error) {
            this.messageService.add({type: 'error', message: 'Error en la eliminación ' + res.msg, life: 5000});
            this.isDelete = false;
          } else {
            this.messageService.add({type: 'success', message: 'Eliminación exitosa', life: 5000});
            this.getAutofillValues();
            this.isDelete = false;
          }
        });
    } else {
      this.isDelete = false;
    }
  }
  getData($event: any) {
    this.valuesAttributesAutofillsTable = $event;
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
}
