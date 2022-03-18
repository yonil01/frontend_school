import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LocalStorageService} from "@app/core/services/local-storage/local-storage.service";
import {ReturnData} from "@app/modules/wizard/entidades/models/entities.models";
import {
  Attribute,
  AttributeAutofill, AttributeResponse,
  Autofill,
  AutofillsValues,
  DatasetValue, ResponseGetAttributesAutofill, ResponseGetValuesAtributtesAutofill,
} from "@app/core/models";
import {AutofillsService} from "@app/modules/wizard/entidades/services/autofills/autofills.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

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
  public isBlock: boolean = false;
  public ResponsevaluesAttributesAutofills: ResponseGetValuesAtributtesAutofill[] = [];
  public valuesAttributesAutofills: Array<any> = [];
  public ResponseAtrributesOfAutofills: ResponseGetAttributesAutofill[] = [];
  public AttributesOfAutofills: AttributeResponse[] = [];
  public hasAttribute: boolean = true;
  public columnsTable: any[] = [];
  public form = new FormGroup({});
  public showCreateValue: boolean = false;

  constructor(private _localStorage: LocalStorageService,
              private autofillsService: AutofillsService,
  ) {
    this.nameClient = this._localStorage.getClient();
    this.nameProject = this._localStorage.getProject();
  }

  ngOnInit(): void {
    this.isBlock = true;
    if (this.selectedAutofill) {
      this.getAttributeAutofills();
      this.getAutofillValues();
    } else {
      this.isBlock = false;
    }
  }

  getAutofillValues(): void {
    this.valuesAttributesAutofills = [];
    this.autofillsService.getAllAutofillValues(this.selectedAutofill.id?.toLowerCase() || '').subscribe((res) => {
      if (res.data?.autofill_response?.length) {
        this.ResponsevaluesAttributesAutofills = res.data.autofill_response;
        this.ResponsevaluesAttributesAutofills.forEach((value) => {
          let valueTemp = value
          // @ts-ignore
          delete valueTemp.id
          // @ts-ignore
          delete valueTemp.created_at
          // @ts-ignore
          delete valueTemp.updated_at
          this.valuesAttributesAutofills.push(valueTemp);
        });
        this.columnsTable = Object.keys(this.valuesAttributesAutofills[0])
        console.log('columnsTable')
        console.log(this.columnsTable);
        console.log('valuesAttributesAutofills')
        console.log(this.valuesAttributesAutofills);
      } else {
        this.ResponsevaluesAttributesAutofills = [];
      }
    });
  }

  async getAttributeAutofills() {
    this.AttributesOfAutofills = [];
    this.autofillsService.getAttributeAutofillsByAutofillID(this.selectedAutofill.id?.toLowerCase() || '').subscribe(
      async (res) => {
        this.ResponseAtrributesOfAutofills = res.data;
        for (const autofill of this.ResponseAtrributesOfAutofills) {
          this.AttributesOfAutofills.push(autofill.attribute);
        }
        console.log('AttributesOfAutofills')
        console.log(this.AttributesOfAutofills);
        this.isBlock = false;
      });
    this.isBlock = false;
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
}
