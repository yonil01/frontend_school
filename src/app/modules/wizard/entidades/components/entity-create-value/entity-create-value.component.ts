import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {AttributeResponse, Autofill} from "@app/core/models";
import {AutofillsService} from "@app/modules/wizard/entidades/services/autofills/autofills.service";

@Component({
  selector: 'app-entity-create-value',
  templateUrl: './entity-create-value.component.html',
  styleUrls: ['./entity-create-value.component.scss']
})
export class EntityCreateValueComponent implements OnInit {
  public isEdit: boolean = false;
  public isBlock: boolean = false;
  @Output()
  public return: EventEmitter<any> = new EventEmitter();
  @Input()
  public valuesAttributesAutofills: any
  @Input()
  public columnsTable: any
  @Input()
  public AttributesOfAutofills: any;
  @Input()
  public selectedAutofill?: Autofill;

  public newValuesForm = new FormGroup({});

  constructor(
    private autofillService: AutofillsService
  ) {
  }

  ngOnInit(): void {
    this.isBlock = true;

    console.log(this.AttributesOfAutofills)
    debugger
    this.generateForm(this.AttributesOfAutofills);
  }

  generateForm(atributos: AttributeResponse[]) {
    atributos.forEach((atributo) => {
      this.newValuesForm.addControl(atributo.name, new FormControl('', this.setValidators(atributo)));
    });
    console.log(this.newValuesForm);
    debugger
    this.isBlock = false;
  }

  setValidators(atributo: AttributeResponse) {
    let formValidators: Array<ValidatorFn> = [];
    let keysOfAtribute = Object.keys(atributo);
    formValidators.push(Validators.required);
    for (let key of keysOfAtribute) {
      if(atributo.type.toLowerCase() == 'number'){
        switch (key) {
          case 'min_length':
            formValidators.push(Validators.min(atributo.min_length));
            break;
          case 'max_length':
            formValidators.push(Validators.max(atributo.max_length));
            break;
        }
      } else {
        switch (key) {
          case 'min_length':
            formValidators.push(Validators.minLength(atributo.min_length));
            break;
          case 'max_length':
            formValidators.push(Validators.maxLength(atributo.max_length));
            break;
        }
      }
    }
    return formValidators;
  }


  onSendForm() {
    const query = {
      autofill_id: this.selectedAutofill?.id,
      autofill_values: {
        autofill_values_1: this.newValuesForm.value
      }
    }
    this.autofillService.createAutofillValue(query).subscribe(
      (response) => {
        console.log(response);
        this.onReturn();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onReturn() {
    this.return.emit(
      {
        id: 'values',
        from: 'createValues',
        action: 'reloadValues'
      }
    );
  }
}
