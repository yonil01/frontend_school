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
  selector: 'app-entity-add-values',
  templateUrl: './entity-add-values.component.html',
  styleUrls: ['./entity-add-values.component.scss']
})
export class EntityAddValuesComponent implements OnInit {
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

  generateForm(atributos: AttributeResponse[]) {
    atributos.forEach((atributo) => {
      this.form.addControl(atributo.name, new FormControl(this.setValidators(atributo)));
    });
    console.log(this.form);
    debugger
  }

  setValidators(atributo: AttributeResponse) {
    let formValidators: Array<any> = [];
    let keysOfAtribute = Object.keys(atributo);
    formValidators.push(Validators.required);
    for (let key of keysOfAtribute) {
      switch (key) {
        case 'min_length':
          formValidators.push(Validators.minLength(atributo.min_length));
          break;
        case 'max_length':
          formValidators.push(Validators.maxLength(atributo.max_length));
          break;
      }
    }
    return formValidators;
  }

  async getAttributeAutofills() {
    this.autofillsService.getAttributeAutofillsByAutofillID(this.selectedAutofill.id?.toLowerCase() || '').subscribe(
      async (res) => {
        this.ResponseAtrributesOfAutofills = res.data;
        for (const autofill of this.ResponseAtrributesOfAutofills) {
          this.AttributesOfAutofills.push(autofill.attribute);
        }
        console.log('AttributesOfAutofills')
        console.log(this.AttributesOfAutofills);
        this.generateForm(this.AttributesOfAutofills);
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

  }
}
